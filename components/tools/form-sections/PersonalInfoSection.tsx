import { Form, Input, Typography, Divider } from 'antd'

const { Text } = Typography
const { TextArea } = Input

export default function PersonalInfoSection() {
  return (
    <div className="fade-in">
      <Typography.Title level={3} className="!mb-4 text-gray-900 dark:text-white text-2xl font-semibold">
        Personal Information
      </Typography.Title>
      <Divider className="!border-gray-200 dark:!border-white/10 !my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="name"
          label={<Text className="text-gray-700 dark:text-white/80">Full Name</Text>}
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="Sabiq Muhammad Antebing Mame"
          />
        </Form.Item>
        <Form.Item
          name="phone"
          label={<Text className="text-gray-700 dark:text-white/80">Phone</Text>}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="(+62) 85691550726"
          />
        </Form.Item>
        <Form.Item
          name="email"
          label={<Text className="text-gray-700 dark:text-white/80">Email</Text>}
          rules={[{ required: true, message: 'Please enter your email' }, { type: 'email' }]}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="sabiqmuhammad98@gmail.com"
          />
        </Form.Item>
        <Form.Item
          name="linkedin"
          label={<Text className="text-gray-700 dark:text-white/80">LinkedIn URL</Text>}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="https://www.linkedin.com/in/your-profile"
          />
        </Form.Item>
      </div>
    </div>
  )
}

