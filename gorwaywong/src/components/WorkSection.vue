<template>
  <section class="work-section">
    <!-- 标题部分 -->
    <h2 class="section-title">工作经历</h2>
  
    <div class="timeline">
      <!-- 遍历工作经历 -->
      <div v-for="(work, index) in works" :key="index" class="timeline-item">
        <!-- 公司信息和时间 -->
        <div class="timeline-header">
          <!-- 左侧：公司名称和职位 -->
          <div class="company-info">
            <h3 class="company">{{ work.company }}</h3>
          </div>
          <!-- 右侧：工作时间 -->
          <span class="duration">{{ work.duration }}</span>
        </div>

        <div  class="work-details">
            <span class="position">{{ work.position }}</span>
        </div>
      
        <!-- 工作职责列表 -->
        <ul v-if="work.responsibilities && work.responsibilities.length" class="responsibilities">
          <li v-for="(responsibility, rIndex) in work.responsibilities" :key="rIndex">
            {{ responsibility }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
// 工作经历数据
const works = [
  {
    company: "广西钢铁热轧总厂",     // 公司名称
    position: "信息化技术员", // 职位
    duration: "2023.7~2025.8",    // 工作时间段
    responsibilities: [      // 工作职责列表
      "宽厚板轧线二级非过程控制系统服务端开发（C++），主要工作：开发与PES系统通讯的轧辊管理模块；与加热炉二级系统交换轧制节奏；停机实绩自动生成上传报文等功能。",
      "平整线二级非过程控制系统服务端开发（C/C++），主要工作：开发与喷印机、打捆机一级系统进行报文通讯功能；获取并转发PES系统工艺设定至PLC等功能。",
      "荣誉情况：专业技术能手（2025）；广西钢铁第一届“百名优秀志愿者（2024）；广西钢铁2023年新入司大学生轮岗实习评比 一等奖。"
    ]
  }
//   {
//     company: "字节跳动",
//     position: "前端实习生",
//     duration: "2022~2023",
//     responsibilities: [
//       "参与抖音电商后台管理系统开发",
//       "实现可视化数据报表功能",
//       "协助团队进行代码审查和优化"
//     ]
//   }
]
</script>

<style scoped>
/* 整个工作经历区块 */
.work-section {
  margin-bottom: 3rem; /* 与教育经历一致的下边距 */
  max-width: 1000px; /* 新增：限制最大宽度 */
  width: 100%; /* 新增：自适应宽度 */
}

/* 标题样式 - 保持与教育经历一致 */
.section-title {
  font-size: 1.8rem; 
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 3px solid #000;
  width: 1000px;
}

/* 时间线容器 - 保持与教育经历一致 */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 单个时间线项目 - 保持与教育经历一致 */
.timeline-item {
  position: relative;
  padding-left: 2rem;
}

/* 时间线圆点 - 保持与教育经历一致 */
.timeline-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.8rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background-color: #000000;
}

/* 公司信息和时间容器 */
.timeline-header {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: flex-start;       /* 顶部对齐 */
  margin-bottom: 0.8rem;         /* 与教育经历一致的下边距 */
}

/* 公司信息容器（公司名称+职位） */
.company-info {
  display: flex;
  flex-direction: column; /* 垂直排列 */
}

/* 公司名称样式 - 与教育经历中的学校名称一致 */
.company {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.3rem; /* 与职位保持适当间距 */
}

/* 职位样式 */
.position {
  font-size: 1.1rem;
  color: #555; /* 稍浅的颜色 */
}

/* 时间样式 - 与教育经历一致 */
.duration {
  font-size: 1.1rem;
  color: #7f8c8d;
  background: #f5f5f5;
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
}

/* 工作职责列表 - 与教育经历的成就列表样式一致 */
.responsibilities {
  padding-left: 1.5rem;
  margin-top: 1rem;
}

/* 工作职责项 - 与教育经历的成就项样式一致 */
.responsibilities li {
  font-size: 1.05rem;
  color: #555;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* 列表标记颜色 - 与教育经历一致 */
.responsibilities li::marker {
  color: #000000;
}

/* 新增：工作详情行样式 */
.work-details {
  display: flex;
  justify-content: space-between; /* 均匀分布 */
  margin-bottom: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid #ddd; /* 添加分隔线 */
}
</style>
