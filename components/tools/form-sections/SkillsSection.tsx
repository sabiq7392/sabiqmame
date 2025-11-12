import { Form, Input, Typography, Divider } from 'antd'

const { Text } = Typography

export default function SkillsSection() {
  return (
    <div className="fade-in">
      <Typography.Title level={3} className="!mb-4 text-gray-900 dark:text-white text-2xl font-semibold">
        Skills
      </Typography.Title>
      <Divider className="!border-gray-200 dark:!border-white/10 !my-4" />
      <Form.Item
        name="programming"
        label={<Text className="text-gray-700 dark:text-white/80">Programming Languages (comma separated)</Text>}
      >
        <Input
          size="large"
          className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
          placeholder="TypeScript, Flutter, Python, NextJS, ReactJS, VueJS, ExpressJS, NestJS"
        />
      </Form.Item>
      <Form.Item
        name="database"
        label={<Text className="text-gray-700 dark:text-white/80">Database (comma separated)</Text>}
      >
        <Input
          size="large"
          className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
          placeholder="MySQL, Elasticsearch"
        />
      </Form.Item>
      <Form.Item
        name="others"
        label={<Text className="text-gray-700 dark:text-white/80">Others (comma separated)</Text>}
      >
        <Input
          size="large"
          className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
          placeholder="Docker, AWS, GitHub, Figma"
        />
      </Form.Item>
    </div>
  )
}

