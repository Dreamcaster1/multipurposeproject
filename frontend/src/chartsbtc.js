import { useEffect, useRef } from "react";
import { createChart, BaselineSeries } from "lightweight-charts";

function BaselineChartBTC({ sparklinedata }) {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || !Array.isArray(sparklinedata)) return;

    const formattedData = sparklinedata
      .map(([time, value]) => ({
        value: Number(value),
        time: Number(time) / 1000,
      }))
      .filter((item) => Number.isFinite(item.value) && Number.isFinite(item.time));

    if (formattedData.length === 0) return;

    const firstPrice = formattedData[0].value;
    const lastPrice = formattedData[formattedData.length - 1].value;
    const isUp = lastPrice >= firstPrice;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth || 220,
      height: 82,

      layout: {
        textColor: "#cbd5e1",
        background: {
          type: "solid",
          color: "transparent",
        },
      },

      grid: {
        vertLines: { visible: false },
        horzLines: { visible: false },
      },

      rightPriceScale: {
        borderVisible: false,
        visible: false,
      },

      timeScale: {
        borderVisible: false,
        visible: false,
        rightOffset: 2,
        barSpacing: 8,
        minBarSpacing: 2,
        fixLeftEdge: true,
        fixRightEdge: true,
      },

      crosshair: {
        vertLine: {
          visible: false,
          labelVisible: false,
        },
        horzLine: {
          visible: false,
          labelVisible: false,
        },
      },

      handleScroll: {
        mouseWheel: false,
        pressedMouseMove: false,
        horzTouchDrag: false,
        vertTouchDrag: false,
      },

      handleScale: {
        mouseWheel: false,
        pinch: false,
        axisPressedMouseMove: {
          time: false,
          price: false,
        },
      },

      localization: {
        locale: "en-GB",
      },
    });

    const baselineSeries = chart.addSeries(BaselineSeries, {
      baseValue: {
        type: "price",
        price: firstPrice,
      },

      baseLineColor: "rgba(0, 0, 0, 0)",
      baseLineWidth: 0,

      topLineColor: isUp ? "rgba(52, 211, 153, 1)" : "rgba(96, 165, 250, 1)",
      topFillColor1: isUp
        ? "rgba(52, 211, 153, 0.26)"
        : "rgba(96, 165, 250, 0.22)",
      topFillColor2: "rgba(255, 255, 255, 0.01)",

      bottomLineColor: "rgba(251, 113, 133, 1)",
      bottomFillColor1: "rgba(255, 255, 255, 0.01)",
      bottomFillColor2: "rgba(251, 113, 133, 0.24)",
    });

    baselineSeries.setData(formattedData);
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver(() => {
      if (!chartContainerRef.current) return;

      chart.applyOptions({
        width: chartContainerRef.current.clientWidth || 220,
      });

      chart.timeScale().fitContent();
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [sparklinedata]);

  return <div className="chartContainer" ref={chartContainerRef} />;
}

export default BaselineChartBTC;