import { Form, Input, Typography, Divider } from 'antd'

const { Text } = Typography

export default function EducationSection() {
  return (
    <div className="fade-in">
      <Typography.Title level={3} className="!mb-4 text-gray-900 dark:text-white text-2xl font-semibold">
        Education
      </Typography.Title>
      <Divider className="!border-gray-200 dark:!border-white/10 !my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="degree"
          label={<Text className="text-gray-700 dark:text-white/80">Degree</Text>}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="Bachelor of Computer Science"
          />
        </Form.Item>
        <Form.Item
          name="institution"
          label={<Text className="text-gray-700 dark:text-white/80">Institution</Text>}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="Sekolah Tinggi Teknologi Terpadu Nurul Fikri"
          />
        </Form.Item>
        <Form.Item
          name="educationPeriod"
          label={<Text className="text-gray-700 dark:text-white/80">Period</Text>}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="Sept 2020 – Sept 2024"
          />
        </Form.Item>
        <Form.Item
          name="educationLocation"
          label={<Text className="text-gray-700 dark:text-white/80">Location</Text>}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="Jakarta, Indonesia"
          />
        </Form.Item>
      </div>
    </div>
  )
}

