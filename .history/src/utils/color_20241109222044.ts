/* eslint-disable */
export const COLOR_NAMES: { [key: string]: string } = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
};

// 색상 이름을 HEX로 변환하는 함수
export const normalizeColor = (color: string): string => {
    if (!color) return '#000000';
    
    // 이미 HEX나 RGB 형식이면 그대로 반환
    if (color.startsWith('#') || color.startsWith('rgb')) {
        return color;
    }
    
    // 색상 이름을 소문자로 변환하여 매핑
    const normalizedColor = color.toLowerCase();
    return COLOR_NAMES[normalizedColor] || color;
};


// 색상을 어둡게 만드는 함수
export const darkenColor = (color: string, amount: number): string => {
    const normalizedColor = normalizeColor(color);

    try {
        // HEX 색상 처리 (#RRGGBB 형식)
        if (normalizedColor.startsWith('#')) {
            // 16진수 문자열을 숫자로 변환
            const num = parseInt(normalizedColor.slice(1), 16);
            
            // 비트 연산으로 RGB 값 추출
            const r = (num >> 16) & 0xff;  // 빨강값 추출
            const g = (num >> 8) & 0xff;   // 초록값 추출
            const b = num & 0xff;          // 파랑값 추출
            
            // 각 색상값을 amount만큼 어둡게
            const darkerR = Math.floor(r * (1 - amount));
            const darkerG = Math.floor(g * (1 - amount));
            const darkerB = Math.floor(b * (1 - amount));
            
            // RGB값을 다시 HEX 문자열로 변환
            const result = `#${(darkerR << 16 | darkerG << 8 | darkerB)
                .toString(16)
                .padStart(6, '0')}`;
                
            return result;
        }
        
        // RGB 색상 처리 (rgb(r,g,b) 형식)
        if (normalizedColor.startsWith('rgb')) {
            const rgb = normalizedColor.match(/\d+/g)?.map(Number);
            if (rgb) {
                const [r, g, b] = rgb;
                return `rgb(${
                    Math.floor(r * (1 - amount))
                }, ${
                    Math.floor(g * (1 - amount))
                }, ${
                    Math.floor(b * (1 - amount))
                })`;
            }
        }
    } catch (error) {
        console.error('Error in darkenColor:', error);
    }
    
    return color;
};