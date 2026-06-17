import * as tf from '@tensorflow/tfjs';
import type { Team, Match } from '../types';

let model: tf.Sequential | null = null;
let isTraining = false;
let isReady = false;

// Normalize values to [-1, 1] roughly to help neural network convergence
const normalizeRanking = (r: number) => 1 - (Math.min(r, 200) / 100); 
const normalizePoints = (p: number) => Math.min(p, 20) / 10;

export function extractFeatures(home: Team, away: Team): number[] {
  return [
    normalizeRanking(home.fifaRanking) - normalizeRanking(away.fifaRanking),
    normalizePoints(home.points) - normalizePoints(away.points),
    ((home.goalsFor - home.goalsAgainst) - (away.goalsFor - away.goalsAgainst)) / 10,
    (home.wins / Math.max(home.matchesPlayed, 1)) - (away.wins / Math.max(away.matchesPlayed, 1))
  ];
}

export async function trainTournamentModel(teams: Team[], matches: Match[]): Promise<void> {
  if (isTraining) return;
  isTraining = true;
  isReady = false;

  console.log('ML Predictor: Gathering training data...');

  const X_data: number[][] = [];
  const Y_data: number[][] = []; 

  // Synthetic baseline data based purely on FIFA rankings so the model learns basic power levels
  teams.forEach(t1 => {
    teams.forEach(t2 => {
      if (t1.countryCode === t2.countryCode) return;
      const rankDiff = t2.fifaRanking - t1.fifaRanking; 
      if (Math.abs(rankDiff) > 20) {
        X_data.push(extractFeatures(t1, t2));
        if (rankDiff > 0) Y_data.push([0.75, 0.20, 0.05]); 
        else Y_data.push([0.05, 0.20, 0.75]);
      } else {
        X_data.push(extractFeatures(t1, t2));
        Y_data.push([0.38, 0.24, 0.38]); 
      }
    });
  });

  // Inject actual match data with high weight to override synthetic priors with actual tournament form
  for (let i = 0; i < 10; i++) { 
    matches.filter(m => m.status === 'completed' && m.score).forEach(m => {
      const home = teams.find(t => t.countryCode === m.homeTeam.countryCode);
      const away = teams.find(t => t.countryCode === m.awayTeam.countryCode);
      if (home && away && m.score) {
        X_data.push(extractFeatures(home, away));
        if (m.score.home > m.score.away) Y_data.push([1, 0, 0]);
        else if (m.score.home === m.score.away) Y_data.push([0, 1, 0]);
        else Y_data.push([0, 0, 1]);
      }
    });
  }

  const xs = tf.tensor2d(X_data);
  const ys = tf.tensor2d(Y_data);

  // Advanced Neural Network Architecture
  model = tf.sequential();
  model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [4] }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  console.log('ML Predictor: Training Advanced Neural Network...');
  await model.fit(xs, ys, {
    epochs: 30,
    batchSize: 64,
    shuffle: true,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 10 === 0) console.log(`ML Epoch ${epoch}: loss = ${logs?.loss.toFixed(4)}`);
      }
    }
  });

  xs.dispose();
  ys.dispose();

  console.log('ML Predictor: Training Complete!');
  isTraining = false;
  isReady = true;
}

export async function predictMatch(home: Team, away: Team): Promise<{ homeWin: number, draw: number, awayWin: number }> {
  if (!isReady || !model) {
    // Graceful fallback
    const rankDiff = away.fifaRanking - home.fifaRanking;
    const homeWin = Math.max(0.1, Math.min(0.8, 0.4 + (rankDiff * 0.01)));
    const draw = 0.2;
    const awayWin = Math.max(0, 1 - homeWin - draw);
    return { homeWin, draw, awayWin };
  }

  const input = tf.tensor2d([extractFeatures(home, away)]);
  const prediction = model.predict(input) as tf.Tensor;
  const values = await prediction.data();
  input.dispose();
  prediction.dispose();

  return {
    homeWin: values[0],
    draw: values[1],
    awayWin: values[2]
  };
}
