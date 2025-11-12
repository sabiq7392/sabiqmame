import { Form, Input, Button, Card, Typography, Divider } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

const { Text } = Typography
const { TextArea } = Input

export default function ProjectsSection() {
  return (
    <div className="fade-in">
      <Typography.Title level={3} className="!mb-4 text-gray-900 dark:text-white text-2xl font-semibold">
        Projects
      </Typography.Title>
      <Divider className="!border-gray-200 dark:!border-white/10 !my-4" />
      <Form.List name="projects">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Card
                key={key}
                className="mb-4 rounded-2xl glass-soft border-gray-200 dark:border-white/10"
              >
                <div className="flex justify-between items-center mb-4">
                  <Typography.Title level={4} className="!m-0 text-gray-900 dark:text-white">
                    Project {name + 1}
                  </Typography.Title>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item
                    {...restField}
                    name={[name, 'title']}
                    label={<Text className="text-gray-700 dark:text-white/80">Project Title</Text>}
                  >
                    <Input
                      className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
                      placeholder="BSMR (Badan Sertifikasi Manajemen Risiko)"
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'company']}
                    label={<Text className="text-gray-700 dark:text-white/80">Company</Text>}
                  >
                    <Input
                      className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
                      placeholder="PT. Quantum Teknologi Nusantara"
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'period']}
                    label={<Text className="text-gray-700 dark:text-white/80">Period</Text>}
                    className="md:col-span-2"
                  >
                    <Input
                      className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
                      placeholder="Jan 2022 - Now"
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'description']}
                    label={<Text className="text-gray-700 dark:text-white/80">Description</Text>}
                    className="md:col-span-2"
                  >
                    <TextArea
                      rows={3}
                      className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
                      placeholder="Web-based certification system for training providers..."
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'achievements']}
                    label={<Text className="text-gray-700 dark:text-white/80">Achievements (one per line)</Text>}
                    className="md:col-span-2"
                    getValueFromEvent={(e) => e.target.value}
                    normalize={(value) => value}
                  >
                    <TextArea
                      rows={5}
                      className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30"
                      placeholder="Developed a centralized logging system...&#10;Deployed staging and production environments..."
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'availableOn']}
                    label={<Text className="text-gray-700 dark:text-white/80">Available On (optional)</Text>}
                    className="md:col-span-2"
                  >
                    <Input
                      className="bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40"
                      placeholder="Available on: App Store & Play Store"
                    />
                  </Form.Item>
                </div>
              </Card>
            ))}
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
              className="border-primary-blue/50 text-primary-blue-light hover:border-primary-blue"
            >
              Add Project
            </Button>
          </>
        )}
      </Form.List>
    </div>
  )
}

