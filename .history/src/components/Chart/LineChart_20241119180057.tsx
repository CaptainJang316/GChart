const createPathData = () => {
    let pathData = '';
    
    // 시작점
    const firstX = axis?.xAxis?.boundaryGap 
        ? 25 
        : barWidth - (barWidth / 6) - 5;

    // 라인 시작점으로 이동
    pathData = `M ${firstX} ${scales.yScale(data[0].value)}`;
    
    // 데이터 포인트들을 연결하는 선
    data.forEach((d, i) => {
        if (i === 0) return;
        const x = axis?.xAxis?.boundaryGap 
            ? 25 + (i * barWidth)
            : barWidth - (barWidth / 6) - 5 + (i * barWidth);
        pathData += ` L ${x} ${scales.yScale(d.value)}`;
    });

    // 마지막 점에서 아래로 수직 이동 (y축 최소값까지)
    const lastX = axis?.xAxis?.boundaryGap 
        ? 25 + ((data.length - 1) * barWidth)
        : barWidth - (barWidth / 6) - 5 + ((data.length - 1) * barWidth);
    pathData += ` V ${scales.yScale(0)}`;  // 수직 이동
    
    // 시작점의 x 좌표로 수평 이동
    pathData += ` H ${firstX}`;  // 수평 이동
    
    // 경로 닫기
    pathData += ' Z';
    
    return pathData;
};