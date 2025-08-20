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
  const chartInstanceRef = useRef<any>(null);

  const handleSaveImage = () => {
    if (chartInstanceRef.current) {
      const url = chartInstanceRef.current.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
      });
      const link = document.createElement('a');
      link.href = url;
      link.download = `bookmark-distribution-${new Date().getTime()}.png`;
      link.click();
    }
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    const chart = echarts.init(chartRef.current);
    chartInstanceRef.current = chart;

    // Helper function to get last folder name
    const getLastFolderName = (folderPath: string): string => {
      if (!folderPath) return t('search.allFolders');
      
      const segments = folderPath.split('/').filter(Boolean);
      const uniqueSegments: string[] = [];
      
      for (const segment of segments) {
        if (uniqueSegments.length === 0 || uniqueSegments[uniqueSegments.length - 1] !== segment) {
          if (!['书签栏', 'Bookmarks Bar', 'Bookmarks', '收藏夹'].includes(segment)) {
            uniqueSegments.push(segment);
          }
        }
      }
      
      return uniqueSegments.length > 0 ? uniqueSegments[uniqueSegments.length - 1] : t('search.allFolders');
    };

    // Prepare data
    const folderStats = bookmarks.reduce((acc, bookmark) => {
      const folder = getLastFolderName(bookmark.folder || '');
      acc[folder] = (acc[folder] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(folderStats).map(([name, value]) => ({
      name,
      value
    }));

    // const barData = Object.entries(folderStats); // Reserved for future use

    // Chart options
    const option = {
      backgroundColor: 'transparent',
      title: {
        text: t('chart.bookmarkDistribution'),
        left: window.innerWidth < 768 ? 'center' : '70%',
        top: window.innerWidth < 768 ? '3%' : '5%',
        textStyle: {
          color: '#1e293b',
          fontSize: window.innerWidth < 768 ? 16 : 24,
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
        show: false
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
          animationDelay: function (_idx: number) {
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

    chartInstanceRef.current.setOption(option);

    // Handle resize
    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstanceRef.current?.dispose();
    };
  }, [bookmarks, t]);

  if (bookmarks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-surface pt-16 sm:pt-20 pb-4 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass rounded-xl sm:rounded-2xl border border-border/50 p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-primary">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-foreground">{t('chart.title')}</h1>
                  <p className="text-sm sm:text-base text-foreground/60">{t('chart.subtitle')}</p>
                </div>
              </div>
              <p className="text-foreground/60 max-w-md">
                {t('chart.noDataDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
      <div className="glass rounded-xl p-6 neon-primary">
        {/* Chart Header with Title and Save Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">{t('chart.bookmarkDistribution')}</h2>
          <button
            onClick={handleSaveImage}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 neon-primary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">{t('chart.saveImage')}</span>
            <span className="sm:hidden">{t('chart.save')}</span>
          </button>
        </div>
        <div 
          ref={chartRef}
          className="w-full"
          style={{ height: '500px', maxHeight: 'calc(100vh - 300px)' }}
        />
      </div>
    </div>
  );
}
