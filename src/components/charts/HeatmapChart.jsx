import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { max } from 'd3-array';

const HeatmapChart = ({ data, chartType, currentPrice }) => {
    const chartContainerRef = useRef();
    const chartRef = useRef();
    const seriesRef = useRef();
    const tooltipRef = useRef();
    const [tooltip, setTooltip] = useState({ visible: false });

    useEffect(() => {
        if (!chartRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
                layout: {
                    background: { color: 'transparent' },
                    textColor: '#D9D9D9',
                },
                grid: {
                    vertLines: { color: '#2A2E39' },
                    horzLines: { color: 'transparent' },
                },
                rightPriceScale: {
                    borderVisible: false,
                },
                timeScale: {
                    borderVisible: false,
                    visible: false,
                },
                crosshair: {
                    mode: CrosshairMode.Normal,
                    vertLine: {
                        visible: false,
                        labelVisible: false,
                    },
                    horzLine: {
                        visible: true,
                        labelVisible: true,
                        style: 2,
                        width: 1,
                        color: '#9B9B9B',
                        labelBackgroundColor: '#131722',
                    },
                },
                handleScroll: false,
                handleScale: false,
            });

            seriesRef.current = chartRef.current.addHistogramSeries({
                priceFormat: {
                    type: 'price',
                    precision: 5,
                    minMove: 0.00001,
                },
                lastValueVisible: false,
                priceLineVisible: false,
            });

            chartRef.current.subscribeCrosshairMove(param => {
                if (param.time && param.seriesPrices && param.seriesPrices.size > 0) {
                    const price = chartType === 'heatmap' ? param.time : param.point.y;
                    const seriesData = data.find(d => d.price === price);
                    if (seriesData) {
                        setTooltip({
                            visible: true,
                            x: param.point.x,
                            y: param.point.y,
                            price: seriesData.price,
                            totalVolume: (seriesData.bid + seriesData.ask).toFixed(2),
                            netDelta: (seriesData.bid - seriesData.ask).toFixed(2),
                        });
                    }
                } else {
                    setTooltip({ visible: false });
                }
            });
        }
    }, []); // Initialize chart only once

    useEffect(() => {
        if (data.length === 0 || !chartRef.current) return;

        const maxVolume = max(data, d => Math.max(d.ask, d.bid));
        const pocVolume = max(data, d => d.bid + d.ask);
        const pocLevel = data.find(d => d.bid + d.ask === pocVolume);

        const chartData = data.map(level => {
            const totalVolume = level.bid + level.ask;
            const isAskDominant = level.ask > level.bid;
            const dominantVolume = isAskDominant ? level.ask : level.bid;
            
            // Refined opacity logic
            const liquidityRatio = dominantVolume / maxVolume;
            const opacity = 0.1 + (liquidityRatio * 0.9); // Scale from 10% to 100%

            let color;
            if (chartType === 'profile' && pocLevel && level.price === pocLevel.price) {
                color = '#FFC107'; // Accent color for POC
            } else {
                color = isAskDominant 
                    ? `rgba(239, 83, 80, ${opacity})` // Red for sells
                    : `rgba(38, 166, 154, ${opacity})`; // Green for buys
            }

            return {
                time: level.price,
                value: totalVolume,
                color,
            };
        });

        const priceScaleOptions = {
            mode: 1, // Normal
            autoScale: true,
            invertScale: true,
        };

        const timeScaleOptions = {
            fixLeftEdge: true,
            fixRightEdge: true,
        };

        if (chartType === 'profile') {
            seriesRef.current.applyOptions({ priceScaleId: 'left' });
            chartRef.current.applyOptions({
                rightPriceScale: { visible: false },
                leftPriceScale: { ...priceScaleOptions, visible: true },
                timeScale: { ...timeScaleOptions, visible: false },
            });
            seriesRef.current.setData(chartData.map(d => ({ time: d.value, value: d.time, color: d.color })));
        } else {
            seriesRef.current.applyOptions({ priceScaleId: 'right' });
            chartRef.current.applyOptions({
                rightPriceScale: { ...priceScaleOptions, visible: true },
                leftPriceScale: { visible: false },
                timeScale: { ...timeScaleOptions, visible: true },
            });
            seriesRef.current.setData(chartData.map(d => ({ time: d.time, value: d.value, color: d.color })));
        }

        // Add a price line for the current price
        seriesRef.current.createPriceLine({
            price: currentPrice,
            color: '#FFFFFF',
            lineWidth: 1,
            lineStyle: 2, // Dashed
            axisLabelVisible: true,
            title: 'Current',
        });

        chartRef.current.timeScale().fitContent();

    }, [data, chartType, currentPrice]);

    return (
        <div className="w-full h-full relative" ref={chartContainerRef}>
            {tooltip.visible && (
                <div
                    ref={tooltipRef}
                    className="absolute z-10 p-2 text-xs text-white rounded-md pointer-events-none bg-black/50"
                    style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
                >
                    <div>Price: <span className="font-bold">{tooltip.price}</span></div>
                    <div>Total Vol: <span className="font-bold">{tooltip.totalVolume}</span></div>
                    <div>Net Delta: <span className="font-bold" style={{ color: tooltip.netDelta > 0 ? '#26A69A' : '#EF5350' }}>{tooltip.netDelta}</span></div>
                </div>
            )}
        </div>
    );
};

export default HeatmapChart;
