export type BaseColor = 'W' | 'B' | 'U' | 'R' | 'G';

export type Generic = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12' | '13' | '14' | '15' | '16';

export type DualColor = 'W/U' | 'W/B' | 'B/R' | 'B/G' | 'U/B' | 'U/R' | 'R/G' | 'R/W' | 'G/W' | 'G/U';

export type DualColorPay = 'G/U/P' | 'G/W/P';

export type ColorPay = 'W/P' | 'B/P' | 'U/P' | 'R/P' | 'G/P';

export type TwoOrColor = '2/W' | '2/B' | '2/U' | '2/R' | '2/G';

export type Color = 
| Generic
| BaseColor
| 'C'
| DualColor
| DualColorPay
| ColorPay
| TwoOrColor
| 'S'