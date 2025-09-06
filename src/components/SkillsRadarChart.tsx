import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SkillsRadarChart: React.FC = () => {
  const chartRef = useRef<ChartJS<"radar">>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Core skills data aggregated by category
  const skillsData = {
    labels: [
      "AI & ML",
      "Web Development",
      "Data Science",
      "Cloud & DevOps",
      "Leadership",
      "Problem Solving",
    ],
    datasets: [
      {
        label: "Technical Proficiency",
        data: [88, 87, 81, 70, 87, 95],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Leadership & Strategic",
        data: [85, 85, 78, 68, 92, 88],
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.2)",
        pointBackgroundColor: "rgb(168, 85, 247)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#e5e7eb",
          font: {
            size: 12,
            family: "Inter, sans-serif",
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        borderColor: "rgba(99, 102, 241, 0.5)",
        borderWidth: 1,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => {
            const skillCategories = [
              {
                name: "AI & ML",
                skills: [
                  "Python: 90%",
                  "RLHF: 85%",
                  "LLMs: 88%",
                  "TensorFlow: 75%",
                ],
              },
              {
                name: "Web Development",
                skills: [
                  "React: 90%",
                  "TypeScript: 85%",
                  "Node.js: 82%",
                  "JavaScript: 90%",
                ],
              },
              {
                name: "Data Science",
                skills: [
                  "SQL: 88%",
                  "Pandas: 85%",
                  "NumPy: 80%",
                  "Statistics: 78%",
                ],
              },
              {
                name: "Cloud & DevOps",
                skills: [
                  "GitHub: 90%",
                  "Google Cloud: 75%",
                  "AWS: 70%",
                  "Docker: 65%",
                ],
              },
              {
                name: "Leadership",
                skills: [
                  "Community Building: 92%",
                  "Team Management: 90%",
                  "Mentoring: 88%",
                ],
              },
              {
                name: "Problem Solving",
                skills: [
                  "Innovation: 88%",
                  "Creative Thinking: 95%",
                  "Strategic Planning: 82%",
                ],
              },
            ];

            const categoryIndex = context.dataIndex;
            const category = skillCategories[categoryIndex];
            const value = context.parsed.r;

            return [
              `${context.dataset.label}`,
              `Score: ${value}/100`,
              "",
              `Top Skills in ${category.name}:`,
              ...category.skills.slice(0, 2), // Show top 2 skills
            ];
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        min: 0,
        ticks: {
          stepSize: 20,
          color: "#9ca3af",
          font: {
            size: 11,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: function (value: any) {
            return value + "%";
          },
        },
        grid: {
          color: "rgba(75, 85, 99, 0.3)",
        },
        angleLines: {
          color: "rgba(156, 163, 175, 0.3)",
        },
        pointLabels: {
          color: "#e5e7eb",
          font: {
            size: 12,
            weight: "bold" as const,
            family: "Inter, sans-serif",
          },
          padding: 8,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.update("none");
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="card mb-8"
    >
      <h3 className="text-2xl font-bold mb-8 text-center gradient-text">
        Skills Overview Radar
      </h3>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">18+</div>
          <div className="text-sm text-gray-400">Skills Mastered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">95%</div>
          <div className="text-sm text-gray-400">Problem Solving</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">92%</div>
          <div className="text-sm text-gray-400">Community Leadership</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold gradient-text">90%</div>
          <div className="text-sm text-gray-400">React & Python</div>
        </div>
      </div>

      {/* Radar Chart Container */}
      <div className="relative mb-6">
        <div className="h-96 md:h-[500px] w-full">
          <Radar
            ref={chartRef}
            data={skillsData}
            options={options}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Chart Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-accent">
              Technical Proficiency
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span>Core programming and technical skills</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span>Framework and library expertise</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span>Infrastructure and tooling knowledge</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold mb-3 text-purple-400">
              Leadership & Strategic
            </h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span>Team management and mentoring</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span>Community building and leadership</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span>Strategic planning and innovation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Insights */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary-dark to-primary border border-accent/20 rounded-lg">
        <h4 className="text-lg font-semibold mb-3 text-accent">
          Skills Insights
        </h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li>
            • Strong foundation across both technical and leadership domains
          </li>
          <li>• Excellence in problem-solving with 95% proficiency rating</li>
          <li>
            • Community leadership skills rate 92%, demonstrating impact beyond
            code
          </li>
          <li>
            • Well-balanced skill set combining cutting-edge tech with strategic
            thinking
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default SkillsRadarChart;
