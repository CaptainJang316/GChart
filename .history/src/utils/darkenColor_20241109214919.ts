export const darkenColor = (color: string, amount: number): string => {
    console.log('Darkening color:', color, 'by amount:', amount); // 디버깅용
    
    try {
        if (color.startsWith('#')) {
            const num = parseInt(color.slice(1), 16);
            const r = Math.floor(((num >> 16) & 0xff) * (1 - amount));
            const g = Math.floor(((num >> 8) & 0xff) * (1 - amount));
            const b = Math.floor((num & 0xff) * (1 - amount));
            const result = `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
            console.log('Resulting color:', result); // 디버깅용
            return result;
        }
        
        // RGB 형식 처리
        if (color.startsWith('rgb')) {
            const rgb = color.match(/\d+/g)?.map(Number);
            if (rgb) {
                const [r, g, b] = rgb;
                const result = `rgb(${
                    Math.floor(r * (1 - amount))
                }, ${
                    Math.floor(g * (1 - amount))
                }, ${
                    Math.floor(b * (1 - amount))
                })`;
                console.log('Resulting color:', result); // 디버깅용
                return result;
            }
        }
    } catch (error) {
        console.error('Error in darkenColor:', error);
    }
    
    return color;
};