import { Form, Input, Typography, Divider } from 'antd'

const { Text } = Typography
const { TextArea } = Input

export default function ProfileSection() {
  return (
    <div className="fade-in">
      <Typography.Title level={3} className="!mb-4 text-gray-900 dark:text-white text-2xl font-semibold">
        Profile
      </Typography.Title>
      <Divider className="!border-gray-200 dark:!border-white/10 !my-4" />
      <Form.Item
        name="profile"
        label={<Text className="text-gray-700 dark:text-white/80">Profile Description</Text>}
      >
        <TextArea
          rows={5}
          className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
          placeholder="Full-Stack Developer with expertise in website and backend development..."
        />
      </Form.Item>
    </div>
  )
}

