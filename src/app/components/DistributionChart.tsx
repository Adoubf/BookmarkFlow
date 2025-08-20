"use client";

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Bookmark } from '../page';
import { useLanguage } from '../contexts/LanguageContext';

interface DistributionChartProps {
  bookmarks: Bookmark[];
}

export default function DistributionChart({ bookmarks }: DistributionChartProps) {
  const { t } = useLanguage();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    // Prepare data
    const folderStats = bookmarks.reduce((acc, bookmark) => {
      const folder = bookmark.folder || t('search.allFolders');
      acc[folder] = (acc[folder] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(folderStats).map(([name, value]) => ({
      name,
      value
    }));

    const barData = Object.entries(folderStats);

    // Chart options
    const option = {
      backgroundColor: 'transparent',
      title: {
        text: t('chart.bookmarkDistribution'),
        left: 'right',
        top: '5%',
        right: '5%',
        textStyle: {
          color: '#1e293b',
          fontSize: 24,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#00d4ff',
        borderWidth: 1,
        textStyle: {
          color: '#1e293b',
          fontSize: 14
        },
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: '#1e293b',
          fontSize: 16,
          fontWeight: '500'
        },
        itemWidth: 16,
        itemHeight: 16,
        itemGap: 10
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: t('chart.saveImage'),
            iconStyle: {
              borderColor: '#00d4ff'
            }
          }
        },
        iconStyle: {
          borderColor: '#e2e8f0'
        }
      },
      series: [
        {
          name: t('chart.bookmarkCount'),
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '60%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#000',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 20,
              fontWeight: 'bold',
              color: '#1e293b'
            }
          },
          labelLine: {
            show: false
          },
          data: pieData,
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx: number) {
            return Math.random() * 200;
          }
        }
      ],
      color: [
        '#00d4ff', '#ff6b9d', '#c471ed', '#12d8fa', 
        '#a8edea', '#fed6e3', '#d299c2', '#ffeaa7',
        '#74b9ff', '#fd79a8', '#fdcb6e', '#6c5ce7'
      ]
    };

    chartInstance.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, [bookmarks, t]);

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-primary mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          {t('chart.noData')}
        </h2>
        <p className="text-foreground/60 max-w-md">
          {t('chart.noDataDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 neon-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">{t('chart.totalBookmarks')}</p>
              <p className="text-2xl font-bold text-primary">{bookmarks.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 neon-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">{t('chart.totalFolders')}</p>
              <p className="text-2xl font-bold text-secondary">
                {new Set(bookmarks.map(b => b.folder).filter(Boolean)).size}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6" style={{boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)'}}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">{t('chart.avgPerFolder')}</p>
              <p className="text-2xl font-bold text-accent">
                {Math.round(bookmarks.length / Math.max(1, new Set(bookmarks.map(b => b.folder).filter(Boolean)).size))}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="glass rounded-xl p-6">
        <div 
          ref={chartRef}
          className="w-full h-96"
          style={{ minHeight: '400px' }}
        />
      </div>
    </div>
  );
}
