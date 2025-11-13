'use client'

import { useState, useCallback, useEffect } from 'react'
import { Typography, Input, Button, Checkbox, Slider, Space, Card, Alert } from 'antd'
import { CopyOutlined, ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { message } from 'antd'

const { Title, Text } = Typography

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
}

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(false)
  const [copied, setCopied] = useState(false)

  const generatePassword = useCallback(() => {
    let charset = ''

    if (includeUppercase) charset += UPPERCASE
    if (includeLowercase) charset += LOWERCASE
    if (includeNumbers) charset += NUMBERS
    if (includeSymbols) charset += SYMBOLS

    if (charset.length === 0) {
      message.error('Please select at least one character type')
      return
    }

    let generated = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length)
      generated += charset[randomIndex]
    }

    setPassword(generated)
    setCopied(false)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  // Generate password on mount and when options change
  useEffect(() => {
    generatePassword()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password)
      setCopied(true)
      message.success('Password copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getPasswordStrength = (pwd: string): { level: 'weak' | 'medium' | 'strong' | 'very-strong', score: number, label: string, color: string } => {
    if (!pwd) return { level: 'weak', score: 0, label: 'No password', color: 'gray' }

    let score = 0

    // Length score
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (pwd.length >= 16) score += 1
    if (pwd.length >= 20) score += 1

    // Character variety
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1

    // Complexity
    if (pwd.length >= 8 && /[a-z]/.test(pwd) && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1
    if (pwd.length >= 12 && /[^a-zA-Z0-9]/.test(pwd)) score += 1

    if (score <= 3) {
      return { level: 'weak', score, label: 'Weak', color: 'red' }
    } else if (score <= 5) {
      return { level: 'medium', score, label: 'Medium', color: 'orange' }
    } else if (score <= 7) {
      return { level: 'strong', score, label: 'Strong', color: 'blue' }
    } else {
      return { level: 'very-strong', score, label: 'Very Strong', color: 'green' }
    }
  }

  const strength = getPasswordStrength(password)

  return (
    <div className="">
      <div className="mb-8">
        <Title level={1} className="!m-0 text-gray-900 dark:text-white text-4xl md:text-3xl font-bold mb-4">
          Password Generator
        </Title>
        <Text className="text-gray-600 dark:text-white/60 text-lg md:text-base">
          Generate secure, random passwords with customizable options
        </Text>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Options Section */}
        <div className="rounded-2xl glass-strong p-6">
          <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold mb-6">
            Options
          </Title>

          <Space direction="vertical" className="w-full" size="large">
            {/* Length Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Text className="text-gray-900 dark:text-white text-sm font-medium">
                  Password Length: {length}
                </Text>
              </div>
              <Slider
                min={4}
                max={64}
                value={length}
                onChange={setLength}
                tooltip={{ formatter: (value) => `${value} characters` }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-white/40 mt-1">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            {/* Character Types */}
            <div>
              <Text className="text-gray-900 dark:text-white text-sm font-medium mb-3 block">
                Include:
              </Text>
              <Space direction="vertical" className="w-full">
                <Checkbox
                  checked={includeUppercase}
                  onChange={(e) => setIncludeUppercase(e.target.checked)}
                  className="text-gray-900 dark:text-white"
                >
                  Uppercase Letters (A-Z)
                </Checkbox>
                <Checkbox
                  checked={includeLowercase}
                  onChange={(e) => setIncludeLowercase(e.target.checked)}
                  className="text-gray-900 dark:text-white"
                >
                  Lowercase Letters (a-z)
                </Checkbox>
                <Checkbox
                  checked={includeNumbers}
                  onChange={(e) => setIncludeNumbers(e.target.checked)}
                  className="text-gray-900 dark:text-white"
                >
                  Numbers (0-9)
                </Checkbox>
                <Checkbox
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="text-gray-900 dark:text-white"
                >
                  Symbols (!@#$%^&*...)
                </Checkbox>
              </Space>
            </div>

            {/* Generate Button */}
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={generatePassword}
              className="w-full bg-primary-blue hover:bg-primary-blue-dark"
              size="large"
            >
              Generate New Password
            </Button>
          </Space>
        </div>

        {/* Result Section */}
        <div className="rounded-2xl glass-strong p-6">
          <Title level={4} className="!m-0 text-gray-900 dark:text-white text-lg font-semibold mb-6">
            Generated Password
          </Title>

          <Space direction="vertical" className="w-full" size="large">
            {/* Password Display */}
            <div>
              <Input
                value={password}
                readOnly
                className="font-mono text-lg text-center bg-white/60 dark:bg-white/5 border-gray-300 dark:border-white/20 text-gray-900 dark:text-white"
                size="large"
              />
            </div>

            {/* Strength Indicator */}
            {password && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Text className="text-gray-900 dark:text-white text-sm font-medium">
                    Strength:
                  </Text>
                  <Text className={`text-sm font-semibold text-${strength.color}-500`}>
                    {strength.label}
                  </Text>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${strength.level === 'weak' ? 'bg-red-500' :
                        strength.level === 'medium' ? 'bg-orange-500' :
                          strength.level === 'strong' ? 'bg-blue-500' :
                            'bg-green-500'
                      }`}
                    style={{
                      width: `${(strength.score / 10) * 100}%`,
                      maxWidth: '100%'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Copy Button */}
            <Button
              type="primary"
              icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
              onClick={handleCopy}
              disabled={!password}
              className={`w-full ${copied
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-primary-blue hover:bg-primary-blue-dark'
                }`}
              size="large"
            >
              {copied ? 'Copied!' : 'Copy Password'}
            </Button>

            {/* Security Tips */}
            <Alert
              message="Security Tips"
              description={
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Use passwords with at least 12 characters</li>
                  <li>Include a mix of uppercase, lowercase, numbers, and symbols</li>
                  <li>Never reuse passwords across different accounts</li>
                  <li>Consider using a password manager</li>
                </ul>
              }
              type="info"
              showIcon
              className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
            />
          </Space>
        </div>
      </div>
    </div>
  )
}

