<template>
  <section class="education-section">
    <!-- 标题部分 -->
    <h2 class="section-title">教育经历</h2>
    
    <div class="timeline">
      <!-- 遍历教育经历 -->
      <div v-for="(edu, index) in education" :key="index" class="timeline-item">
        <!-- 学校名称和时间 -->
        <div class="timeline-header">
          <h3 class="institution">{{ edu.institution }}</h3>
          <span class="duration">{{ edu.duration }}</span>
        </div>
        
        <!-- 新增：教育详情行 -->
        <div class="education-details">
          <span class="detail-item">{{ edu.college }}</span>
          <span class="detail-item">{{ edu.major }}</span>
          <span class="detail-item">{{ edu.degree }}</span>
        </div>
        
        <!-- 成就列表 -->
        <ul v-if="edu.achievements && edu.achievements.length" class="achievements">
          <li v-for="(achievement, aIndex) in edu.achievements" :key="aIndex">
            {{ achievement }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
// 教育数据
const education = [
  {
    institution: "中国农业大学", // 学校名称
    college: "信息与电气工程学院", // 新增：学院
    major: "计算机科学与技术",   // 专业
    degree: "工学学士",         // 新增：学位
    duration: "2019~2023",     // 时间
    achievements: [
      "GPA: 3.51/4.0",
      "基于光谱分析的小麦光合参数预测系统，2024SR0101196，软件著作权登记"
    ]
  },
  {
    institution: "广西大学",
    college: "计算机与电子信息学院",
    major: "计算机技术",
    degree: "专硕",
    duration: "2025至今",
    achievements: []
  }
]
</script>

<style scoped>
/* 整个教育经历区块 */
.education-section {
  margin-bottom: 3rem; /* 增大下边距 */
  max-width: 1000px; /* 新增：限制最大宽度 */
  width: 100%; /* 新增：自适应宽度 */
}

/* 标题样式 */
.section-title {
  font-size: 1.8rem; /* 放大标题字体 */
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem; /* 增大下边距 */
  padding-bottom: 0.8rem; /* 增加内边距 */
  border-bottom: 3px solid #000; /* 改为黑色3px粗的固定长度横线 */
  width: 1000px; /* 固定横线长度 */
}

/* 时间线容器 */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem; /* 增大项目间距 */
}

/* 单个时间线项目 */
.timeline-item {
  position: relative;
  padding-left: 2rem; /* 增加左侧留白 */
}

/* 时间线圆点 */
.timeline-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.8rem; /* 调整垂直位置 */
  width: 1rem; /* 增大圆点 */
  height: 1rem;
  border-radius: 50%;
  background-color: #000000;
}

/* 学校名称和时间容器 */
.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.8rem; /* 增大下边距 */
}

/* 学校名称样式 */
.institution {
  font-size: 1.4rem; /* 放大字体 */
  font-weight: 600;
  color: #2c3e50;
}

/* 时间样式 */
.duration {
  font-size: 1.1rem; /* 放大字体 */
  color: #7f8c8d;
  background: #f5f5f5;
  padding: 0.3rem 0.8rem; /* 增大内边距 */
  border-radius: 6px;
}

/* 新增：教育详情行样式 */
.education-details {
  display: flex;
  justify-content: space-between; /* 均匀分布 */
  margin-bottom: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid #ddd; /* 添加分隔线 */
}

/* 详情项样式 */
.detail-item {
  font-size: 1.1rem; /* 放大字体 */
  color: #555;
  flex: 1; /* 等宽分布 */
  text-align: center; /* 居中显示 */
}

/* 成就列表 */
.achievements {
  padding-left: 1.5rem; /* 增加内边距 */
  margin-top: 1rem; /* 增加上边距 */
}

/* 成就项 */
.achievements li {
  font-size: 1.05rem; /* 放大字体 */
  color: #555;
  margin-bottom: 0.5rem; /* 增加下边距 */
  line-height: 1.6; /* 增加行高 */
}

/* 列表标记颜色 */
.achievements li::marker {
  color: #000000;
}
</style>
