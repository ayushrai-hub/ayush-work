import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, RadialLinearScale, RadarController } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, RadialLinearScale, RadarController);

const GPAChart: React.FC = () => {
  const chartRef = useRef<ChartJS<"line">>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // GPA data based on education timeline
  const gpaData = [
    { semester: '2020-II', gpa: 8.2, course: 'B.Tech - Year 1' },
    { semester: '2021-I', gpa: 8.8, course: 'B.Tech - Year 1' },
    { semester: '2021-II', gpa: 9.1, course: 'B.Tech - Year 2' },
    { semester: '2022-I', gpa: 8.5, course: 'B.Tech - Year 2' },
    { semester: '2022-II', gpa: 8.9, course: 'B.Tech - Year 3' },
    { semester: '2023-I', gpa: 8.2, course: 'B.Tech - Year 3' },
    { semester: '2023-II', gpa: 8.6, course: 'B.Tech - Year 4' },
    { semester: '2024-I', gpa: 8.1, course: 'B.Tech - Year 4' },
  ];

  // IIT Madras BS program GPA data (parallel)
  const bsGpaData = [
    { semester: '2021-I', gpa: 7.2, course: 'BS - Year 1' },
    { semester: '2021-II', gpa: 6.9, course: 'BS - Year 1' },
    { semester: '2022-I', gpa: 7.1, course: 'BS - Year 2' },
    { semester: '2022-II', gpa: 6.8, course: 'BS - Year 2' },
    { semester: '2023-I', gpa: 7.3, course: 'BS - Year 3' },
    { semester: '2023-II', gpa: 6.7, course: 'BS - Year 3' },
    { semester: '2024-I', gpa: 7.0, course: 'BS - Year 4' },
  ];

  const data = {
    labels: gpaData.map(item => item.semester),
    datasets: [
      {
        label: 'B.Tech CSE GPA',
        data: gpaData.map(item => item.gpa),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'BS Data Science GPA',
        data: bsGpaData.map(bs => {
          const index = gpaData.findIndex(item => item.semester === bs.semester);
          return index >= 0 ? bs.gpa : null;
        }),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f9fafb',
        bodyColor: '#e5e7eb',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const semester = gpaData[context.dataIndex];
            const bsSemester = bsGpaData.find(bs => {
              const gpaIndex = gpaData.findIndex(g => g.semester === bs.semester);
              return gpaIndex === context.dataIndex;
            });
            return [
              `GPA: ${context.parsed.y.toFixed(1)}/10.0`,
              ...(semester ? [semester.course] : []),
              ...(bsSemester && bsSemester.course !== (semester?.course) ? [bsSemester.course] : [])
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 6.0,
        max: 10.0,
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return value + '/10.0';
          }
        },
        title: {
          display: true,
          text: 'GPA',
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'bold' as const,
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 10,
          },
        },
        title: {
          display: true,
          text: 'Semester',
          color: '#9ca3af',
          font: {
            size: 12,
            weight: 'bold' as const,
          }
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  useEffect(() => {
    // Update chart colors when theme changes
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.update('none');
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="card"
    >
      <h3 className="text-2xl font-bold mb-8 text-center gradient-text">
        GPA Progression Chart
      </h3>

      {/* GPA Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">8.47</div>
          <div className="text-sm text-gray-400">B.Tech Average</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">6.86</div>
          <div className="text-sm text-gray-400">BS Average</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">9.1</div>
          <div className="text-sm text-gray-400">Highest GPA</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">8/8</div>
          <div className="text-sm text-gray-400">Semesters</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <div className="h-80 md:h-96 w-full">
          <Line
            ref={chartRef}
            data={data}
            options={options}
            className="w-full h-full"
          />
        </div>

        {/* Chart Legend Explanation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <div>
              <span className="text-white font-semibold">B.Tech CSE</span>
              <p className="text-gray-400">Lakshmi Narain College of Technology</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <div>
              <span className="text-white font-semibold">BS Data Science</span>
              <p className="text-gray-400">IIT Madras (Parallel Program)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary-dark to-primary border border-accent/20 rounded-lg">
        <h4 className="text-lg font-semibold mb-3 text-accent">Insights</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>• Consistent performance across 8 semesters</li>
          <li>• Balanced academic load with dual degree program</li>
          <li>• Strong foundation in computer science and data science</li>
          <li>• Self-motivated learning during parallel degree</li>
        </ul>
      </div>
    </motion.div>
  );
};

export default GPAChart;
