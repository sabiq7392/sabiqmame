import { Form, Input, Typography, Divider } from 'antd'

const { Text } = Typography
const { TextArea } = Input

export default function OrganizationSection() {
  return (
    <div className="fade-in">
      <Typography.Title level={3} className="!mb-4 text-gray-900 dark:text-white text-2xl font-semibold">
        Organization Experience
      </Typography.Title>
      <Divider className="!border-gray-200 dark:!border-white/10 !my-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item
          name="orgName"
          label={<Text className="text-gray-700 dark:text-white/80">Organization Name</Text>}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="Google Developer Student Club (GDSC)"
          />
        </Form.Item>
        <Form.Item
          name="orgInstitution"
          label={<Text className="text-gray-700 dark:text-white/80">Institution</Text>}
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="STT Terpadu Nurul Fikri"
          />
        </Form.Item>
        <Form.Item
          name="orgPeriod"
          label={<Text className="text-gray-700 dark:text-white/80">Period</Text>}
          className="md:col-span-2"
        >
          <Input
            size="large"
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
            placeholder="Dec 2022 – Aug 2023"
          />
        </Form.Item>
        <Form.Item
          name="orgActivities"
          label={<Text className="text-gray-700 dark:text-white/80">Activities (one per line)</Text>}
          className="md:col-span-2"
          getValueFromEvent={(e) => e.target.value}
          normalize={(value) => value}
        >
          <TextArea
            rows={4}
            className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30"
            placeholder="Organized and managed frontend team members...&#10;Led a 3-month bootcamp as an instructor..."
          />
        </Form.Item>
      </div>
    </div>
  )
}

