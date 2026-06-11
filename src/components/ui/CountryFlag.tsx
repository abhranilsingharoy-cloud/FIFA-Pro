interface CountryFlagProps {
  countryCode: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
}

const sizes = {
  sm: { w: 20, h: 15 },
  md: { w: 28, h: 21 },
  lg: { w: 40, h: 30 },
  xl: { w: 64, h: 48 },
};

export default function CountryFlag({ countryCode, size = 'md', style }: CountryFlagProps) {
  const code = countryCode.toLowerCase().replace('gb-eng', 'gb').replace('gb', 'gb');
  const { w, h } = sizes[size];
  return (
    <img
      src={`https://flagcdn.com/${w * 2}x${h * 2}/${code}.png`}
      alt={`${countryCode} flag`}
      width={w}
      height={h}
      style={{ borderRadius: 2, objectFit: 'cover', flexShrink: 0, ...style }}
      loading="lazy"
    />
  );
}
