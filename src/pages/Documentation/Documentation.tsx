import {
    Card,
    Row,
    Col,
    Collapse,
    Tag,
    Button,
    Input,
    Space,
    Steps,
    Alert,
    Timeline,
    Divider,
    Breadcrumb,
    Tabs,
    List,
    Avatar,
    Badge,
    Tooltip,
    Typography,
    Anchor,
    Select,
    Switch,
    Progress
} from "antd";
import {
    BookOutlined,
    CodeOutlined,
    QuestionCircleOutlined,
    RocketOutlined,
    ApiOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    DownloadOutlined,
    SearchOutlined,
    FileTextOutlined,
    VideoCameraOutlined,
    GithubOutlined,
    SlackOutlined,
    ArrowRightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    StarOutlined,
    PlayCircleOutlined,
    CopyOutlined
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Prism as SyntaxHighlighterPrism } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Option } = Select;
const { Link } = Anchor;

export default function Documentation() {
    const [activeSection, setActiveSection] = useState('getting-started');
    const [searchTerm, setSearchTerm] = useState('');
    const [apiEndpoint, setApiEndpoint] = useState('/api/v1/cars');
    const [darkMode, setDarkMode] = useState(false);

    // Mock documentation data
    const gettingStartedSteps = [
        {
            title: 'Account Setup',
            description: 'Create your admin account and verify your email',
            content: 'Sign up with your email, verify it, and complete your profile setup.',
            icon: <SafetyCertificateOutlined />
        },
        {
            title: 'Install Dependencies',
            description: 'Install required packages and setup environment',
            content: 'npm install followed by configuring your environment variables.',
            icon: <CodeOutlined />
        },
        {
            title: 'Database Setup',
            description: 'Configure and migrate your database',
            content: 'Set up PostgreSQL/MongoDB and run database migrations.',
            icon: <DatabaseOutlined />
        },
        {
            title: 'Run Application',
            description: 'Start the development server',
            content: 'npm run dev to start the application locally.',
            icon: <RocketOutlined />
        },
    ];

    const apiEndpoints = [
        {
            method: 'GET',
            endpoint: '/api/v1/cars',
            description: 'Get all cars',
            authentication: 'Optional',
        },
        {
            method: 'POST',
            endpoint: '/api/v1/cars',
            description: 'Create new car',
            authentication: 'Required',
        },
        {
            method: 'GET',
            endpoint: '/api/v1/cars/{id}',
            description: 'Get car by ID',
            authentication: 'Optional',
        },
        {
            method: 'PUT',
            endpoint: '/api/v1/cars/{id}',
            description: 'Update car',
            authentication: 'Required',
        },
        {
            method: 'DELETE',
            endpoint: '/api/v1/cars/{id}',
            description: 'Delete car',
            authentication: 'Required',
        },
    ];

    const codeExamples = {
        getCars: `// JavaScript Fetch API
fetch('/api/v1/cars')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Axios
axios.get('/api/v1/cars')
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));`,

        createCar: `// Create new car
const carData = {
  name: "Tesla Model 3",
  color: "Midnight Blue",
  pricePerHour: 45,
  isElectric: true
};

fetch('/api/v1/cars', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: JSON.stringify(carData)
})
.then(response => response.json())
.then(data => console.log(data));`,

        reactComponent: `import React, { useState } from 'react';
import { Button, Card, message } from 'antd';

const CarComponent = () => {
  const [loading, setLoading] = useState(false);
  
  const handleBookCar = async (carId) => {
    setLoading(true);
    try {
      const response = await fetch(\`/api/v1/bookings\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId, userId: '123' })
      });
      const data = await response.json();
      message.success('Car booked successfully!');
    } catch (error) {
      message.error('Failed to book car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Car Booking">
      <Button 
        type="primary" 
        loading={loading}
        onClick={() => handleBookCar('car123')}
      >
        Book Now
      </Button>
    </Card>
  );
};`
    };

    const faqs = [
        {
            question: 'How do I reset my admin password?',
            answer: 'Go to Settings > Security > Reset Password. You will receive an email with reset instructions.',
            category: 'Account'
        },
        {
            question: 'How to add a new vehicle to the system?',
            answer: 'Navigate to Manage Cars > Add New Car. Fill in the required details and upload vehicle images.',
            category: 'Vehicles'
        },
        {
            question: 'How to generate financial reports?',
            answer: 'Go to Reports section and select the report type. You can filter by date range and export as PDF/Excel.',
            category: 'Reports'
        },
        {
            question: 'API rate limits?',
            answer: 'Free tier: 100 requests/hour. Pro tier: 1000 requests/hour. Enterprise: Custom limits.',
            category: 'API'
        },
    ];

    const tutorials = [
        {
            title: 'Getting Started Video',
            description: '15-minute tutorial covering basic setup',
            duration: '15:30',
            level: 'Beginner',
            icon: <VideoCameraOutlined />
        },
        {
            title: 'API Integration Guide',
            description: 'Complete guide to integrating with our API',
            duration: '25:00',
            level: 'Intermediate',
            icon: <ApiOutlined />
        },
        {
            title: 'Advanced Analytics',
            description: 'Deep dive into reporting and analytics features',
            duration: '35:00',
            level: 'Advanced',
            icon: <BookOutlined />
        },
    ];

    const resources = [
        {
            title: 'GitHub Repository',
            description: 'Source code and issues',
            icon: <GithubOutlined />,
            link: 'https://github.com/your-repo',
            color: '#333'
        },
        {
            title: 'API Playground',
            description: 'Interactive API testing',
            icon: <CodeOutlined />,
            link: '/api-playground',
            color: '#4335A7'
        },
        {
            title: 'Community Slack',
            description: 'Join our community',
            icon: <SlackOutlined />,
            link: 'https://slack.com/your-community',
            color: '#4A154B'
        },
        {
            title: 'Download SDK',
            description: 'Client libraries',
            icon: <DownloadOutlined />,
            link: '/downloads',
            color: '#1890ff'
        },
    ];

    const changeLog = [
        {
            version: 'v2.1.0',
            date: '2024-01-15',
            changes: ['Added real-time analytics', 'Improved dashboard performance', 'New reporting features'],
            type: 'major'
        },
        {
            version: 'v2.0.5',
            date: '2024-01-10',
            changes: ['Bug fixes in booking system', 'Security enhancements'],
            type: 'patch'
        },
        {
            version: 'v2.0.0',
            date: '2024-01-01',
            changes: ['Complete UI redesign', 'New admin dashboard', 'Enhanced API endpoints'],
            type: 'major'
        },
    ];

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        // You can add a notification here
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}

        >
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <Title level={1} className="!mb-2">
                            <BookOutlined className="mr-3 text-[#4335A7]" />
                            Documentation
                        </Title>
                        <Paragraph className="text-lg text-gray-600 max-w-3xl">
                            Comprehensive guides, API references, and tutorials to help you build with Car Rental Management System.
                        </Paragraph>
                    </div>
                    <Space>
                        <Switch
                            checked={darkMode}
                            onChange={setDarkMode}
                            checkedChildren="Dark"
                            unCheckedChildren="Light"
                            className="mr-2"
                        />
                        <Button
                            type="primary"
                            icon={<RocketOutlined />}
                            className="bg-[#4335A7] hover:bg-[#372887] border-0"
                            href="#getting-started"
                        >
                            Quick Start
                        </Button>
                    </Space>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8">
                    <Input
                        size="large"
                        placeholder="Search documentation..."
                        prefix={<SearchOutlined className="text-gray-400" />}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        allowClear
                        className="shadow-lg rounded-full"
                    />
                </div>

                {/* Quick Stats */}
                <Row gutter={[16, 16]} className="mb-8">
                    <Col xs={24} sm={12} md={6}>
                        <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-100">
                                    <FileTextOutlined className="text-blue-600 text-lg" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Articles</div>
                                    <div className="text-xl font-bold text-gray-900">42</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-100">
                                    <CodeOutlined className="text-green-600 text-lg" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">API Endpoints</div>
                                    <div className="text-xl font-bold text-gray-900">28</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-100">
                                    <VideoCameraOutlined className="text-purple-600 text-lg" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Tutorials</div>
                                    <div className="text-xl font-bold text-gray-900">15</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-orange-100">
                                    <TeamOutlined className="text-orange-600 text-lg" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Community</div>
                                    <div className="text-xl font-bold text-gray-900">1.2k+</div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            <Row gutter={[24, 24]}>
                {/* Sidebar Navigation */}
                <Col xs={24} lg={6}>
                    <Card className="sticky top-6 shadow-lg">
                        <Anchor
                            affix={false}
                            getContainer={() => document.getElementById('content-area') || window}
                            className="doc-anchor"
                        >
                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Quick Links</h3>
                                <Space direction="vertical" className="w-full">
                                    <Button
                                        type="link"
                                        href="#getting-started"
                                        className="!justify-start !p-2 !text-left"
                                    >
                                        🚀 Getting Started
                                    </Button>
                                    <Button
                                        type="link"
                                        href="#api-reference"
                                        className="!justify-start !p-2 !text-left"
                                    >
                                        📚 API Reference
                                    </Button>
                                    <Button
                                        type="link"
                                        href="#tutorials"
                                        className="!justify-start !p-2 !text-left"
                                    >
                                        🎓 Tutorials
                                    </Button>
                                    <Button
                                        type="link"
                                        href="#faq"
                                        className="!justify-start !p-2 !text-left"
                                    >
                                        ❓ FAQ
                                    </Button>
                                </Space>
                            </div>

                            <Divider />

                            <div className="mb-4">
                                <h3 className="font-semibold text-gray-800 mb-2">Topics</h3>
                                <div className="space-y-2">
                                    {['Authentication', 'Vehicles', 'Bookings', 'Payments', 'Reports', 'Settings'].map((topic) => (
                                        <Tag key={topic} className="cursor-pointer hover:bg-blue-50">
                                            {topic}
                                        </Tag>
                                    ))}
                                </div>
                            </div>

                            <Divider />

                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Resources</h3>
                                <List
                                    size="small"
                                    dataSource={resources}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Button
                                                type="link"
                                                href={item.link}
                                                icon={item.icon}
                                                className="!p-0 !h-auto !text-gray-700 hover:!text-[#4335A7]"
                                            >
                                                {item.title}
                                            </Button>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </Anchor>
                    </Card>
                </Col>

                {/* Main Content */}
                <Col xs={24} lg={18}>
                    <div id="content-area">
                        {/* Getting Started Section */}
                        <motion.section
                            id="getting-started"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <Card className="shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-[#4335A7] to-[#6A4BAA]">
                                        <RocketOutlined className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <Title level={2} className="!mb-0">Getting Started</Title>
                                        <Text type="secondary">Start building in 5 minutes</Text>
                                    </div>
                                </div>

                                <Steps current={1} className="mb-8">
                                    {gettingStartedSteps.map((step, index) => (
                                        <Step
                                            key={index}
                                            title={step.title}
                                            description={step.description}
                                            icon={step.icon}
                                        />
                                    ))}
                                </Steps>

                                <Alert
                                    message="Prerequisites"
                                    description="Make sure you have Node.js 16+ and npm/yarn installed on your system."
                                    type="info"
                                    showIcon
                                    className="mb-6"
                                />

                                <Collapse defaultActiveKey={['1']} className="mb-6">
                                    <Panel header="Installation Guide" key="1">
                                        <div className="space-y-4">
                                            <div>
                                                <Title level={5}>1. Clone Repository</Title>
                                                <div className="relative">
                                                    <SyntaxHighlighterPrism
                                                        language="bash"
                                                        style={darkMode ? vscDarkPlus : docco}
                                                        className="rounded-lg"
                                                    >
                                                        git clone https://github.com/your-repo/car-rental.git
                                                    </SyntaxHighlighterPrism>
                                                    <Button
                                                        type="text"
                                                        icon={<CopyOutlined />}
                                                        className="absolute top-2 right-2"
                                                        onClick={() => handleCopyCode('git clone https://github.com/your-repo/car-rental.git')}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Title level={5}>2. Install Dependencies</Title>
                                                <div className="relative">
                                                    <SyntaxHighlighterPrism
                                                        language="bash"
                                                        style={darkMode ? vscDarkPlus : docco}
                                                        className="rounded-lg"
                                                    >
                                                        npm install
                                                        # or
                                                        yarn install
                                                    </SyntaxHighlighterPrism>
                                                    <Button
                                                        type="text"
                                                        icon={<CopyOutlined />}
                                                        className="absolute top-2 right-2"
                                                        onClick={() => handleCopyCode('npm install\n# or\nyarn install')}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Title level={5}>3. Environment Setup</Title>
                                                <div className="relative">
                                                    <SyntaxHighlighterPrism
                                                        language="bash"
                                                        style={darkMode ? vscDarkPlus : docco}
                                                        className="rounded-lg"
                                                    >
                                                        cp .env.example .env
                                                        # Edit .env with your configuration
                                                    </SyntaxHighlighterPrism>
                                                    <Button
                                                        type="text"
                                                        icon={<CopyOutlined />}
                                                        className="absolute top-2 right-2"
                                                        onClick={() => handleCopyCode('cp .env.example .env\n# Edit .env with your configuration')}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Panel>
                                </Collapse>

                                <Alert
                                    message="Need Help?"
                                    description={
                                        <span>
                                            Join our <a href="#community">community</a> or check the <a href="#faq">FAQ section</a> for common issues.
                                        </span>
                                    }
                                    type="success"
                                    showIcon
                                />
                            </Card>
                        </motion.section>

                        {/* API Reference Section */}
                        <motion.section
                            id="api-reference"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-12"
                        >
                            <Card className="shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                                        <ApiOutlined className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <Title level={2} className="!mb-0">API Reference</Title>
                                        <Text type="secondary">Complete API documentation</Text>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <Title level={4}>Select Endpoint</Title>
                                    <Select
                                        value={apiEndpoint}
                                        onChange={setApiEndpoint}
                                        className="w-full mb-4"
                                    >
                                        {apiEndpoints.map((endpoint, index) => (
                                            <Option key={index} value={endpoint.endpoint}>
                                                <div className="flex items-center gap-2">
                                                    <Tag color={
                                                        endpoint.method === 'GET' ? 'blue' :
                                                            endpoint.method === 'POST' ? 'green' :
                                                                endpoint.method === 'PUT' ? 'orange' :
                                                                    endpoint.method === 'DELETE' ? 'red' : 'default'
                                                    }>
                                                        {endpoint.method}
                                                    </Tag>
                                                    <span>{endpoint.endpoint}</span>
                                                    <Text type="secondary" className="ml-auto">
                                                        {endpoint.description}
                                                    </Text>
                                                </div>
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="mb-6">
                                    <Title level={4}>Example Request</Title>
                                    <div className="relative">
                                        <SyntaxHighlighterPrism
                                            language="javascript"
                                            style={darkMode ? vscDarkPlus : docco}
                                            className="rounded-lg"
                                        >
                                            {codeExamples.getCars}
                                        </SyntaxHighlighterPrism>
                                        <Button
                                            type="text"
                                            icon={<CopyOutlined />}
                                            className="absolute top-2 right-2"
                                            onClick={() => handleCopyCode(codeExamples.getCars)}
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <Title level={4}>Response Example</Title>
                                    <div className="relative">
                                        <SyntaxHighlighterPrism
                                            language="json"
                                            style={darkMode ? vscDarkPlus : docco}
                                            className="rounded-lg"
                                        >
                                            {`{
                                    "success": true,
                                    "data": [
                                        {
                                        "_id": "60d21b4667d0d8992e610c85",
                                        "name": "Tesla Model 3",
                                        "color": "Midnight Blue",
                                        "pricePerHour": 45,
                                        "status": "available",
                                        "image": "https://example.com/car.jpg"
                                        }
                                    ],
                                    "total": 1
                                    }`}
                                        </SyntaxHighlighterPrism>
                                        <Button
                                            type="text"
                                            icon={<CopyOutlined />}
                                            className="absolute top-2 right-2"
                                            onClick={() => handleCopyCode(`{
                                    "success": true,
                                    "data": [
                                        {
                                        "_id": "60d21b4667d0d8992e610c85",
                                        "name": "Tesla Model 3",
                                        "color": "Midnight Blue",
                                        "pricePerHour": 45,
                                        "status": "available",
                                        "image": "https://example.com/car.jpg"
                                        }
                                    ],
                                    "total": 1
                                    }`)}
                                        />
                                    </div>
                                </div>

                                <Alert
                                    message="API Authentication"
                                    description={
                                        <div>
                                            <p>All write operations require authentication. Include your API key in the Authorization header:</p>
                                            <code>Authorization: Bearer YOUR_API_KEY</code>
                                        </div>
                                    }
                                    type="warning"
                                    showIcon
                                />
                            </Card>
                        </motion.section>

                        {/* Tutorials Section */}
                        <motion.section
                            id="tutorials"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mb-12"
                        >
                            <Card className="shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                                        <VideoCameraOutlined className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <Title level={2} className="!mb-0">Tutorials & Guides</Title>
                                        <Text type="secondary">Learn by following step-by-step guides</Text>
                                    </div>
                                </div>

                                <Row gutter={[16, 16]} className="mb-6">
                                    {tutorials.map((tutorial, index) => (
                                        <Col xs={24} md={8} key={index}>
                                            <Card
                                                hoverable
                                                className="h-full shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="p-2 rounded-lg bg-blue-50">
                                                        {tutorial.icon}
                                                    </div>
                                                    <div>
                                                        <Badge count={tutorial.level} color={
                                                            tutorial.level === 'Beginner' ? 'blue' :
                                                                tutorial.level === 'Intermediate' ? 'orange' : 'red'
                                                        } />
                                                    </div>
                                                </div>
                                                <Title level={4} className="!mb-2">{tutorial.title}</Title>
                                                <Paragraph type="secondary">{tutorial.description}</Paragraph>
                                                <div className="flex items-center justify-between mt-4">
                                                    <Text type="secondary">
                                                        <ClockCircleOutlined className="mr-1" />
                                                        {tutorial.duration}
                                                    </Text>
                                                    <Button type="link" icon={<PlayCircleOutlined />}>
                                                        Watch
                                                    </Button>
                                                </div>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                <div className="mb-6">
                                    <Title level={4}>React Component Example</Title>
                                    <div className="relative">
                                        <SyntaxHighlighterPrism
                                            language="javascript"
                                            style={darkMode ? vscDarkPlus : docco}
                                            className="rounded-lg"
                                        >
                                            {codeExamples.reactComponent}
                                        </SyntaxHighlighterPrism>
                                        <Button
                                            type="text"
                                            icon={<CopyOutlined />}
                                            className="absolute top-2 right-2"
                                            onClick={() => handleCopyCode(codeExamples.reactComponent)}
                                        />
                                    </div>
                                </div>

                                <Progress percent={65} status="active" className="mb-4" />
                                <Text type="secondary">Complete the tutorials to unlock advanced features</Text>
                            </Card>
                        </motion.section>

                        {/* FAQ Section */}
                        <motion.section
                            id="faq"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mb-12"
                        >
                            <Card className="shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                                        <QuestionCircleOutlined className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <Title level={2} className="!mb-0">Frequently Asked Questions</Title>
                                        <Text type="secondary">Common questions and solutions</Text>
                                    </div>
                                </div>

                                <Collapse accordion className="mb-6">
                                    {faqs.map((faq, index) => (
                                        <Panel
                                            key={index}
                                            header={
                                                <div className="flex items-center justify-between">
                                                    <span>{faq.question}</span>
                                                    <Tag>{faq.category}</Tag>
                                                </div>
                                            }
                                        >
                                            <Paragraph>{faq.answer}</Paragraph>
                                        </Panel>
                                    ))}
                                </Collapse>

                                <Alert
                                    message="Can't find your question?"
                                    description={
                                        <span>
                                            Check our <a href="#community">community forum</a> or <a href="#contact">contact support</a>.
                                        </span>
                                    }
                                    type="info"
                                    showIcon
                                />
                            </Card>
                        </motion.section>

                        {/* Changelog Section */}
                        <motion.section
                            id="changelog"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="shadow-lg">
                                <Title level={2} className="!mb-6">📝 Changelog</Title>
                                <Timeline>
                                    {changeLog.map((log, index) => (
                                        <Timeline.Item
                                            key={index}
                                            color={
                                                log.type === 'major' ? 'green' :
                                                    log.type === 'patch' ? 'blue' : 'gray'
                                            }
                                            dot={log.type === 'major' ? <StarOutlined /> : null}
                                        >
                                            <div className="flex items-center gap-4 mb-2">
                                                <Title level={4} className="!mb-0">{log.version}</Title>
                                                <Tag color="default">{log.date}</Tag>
                                                <Tag color={log.type === 'major' ? 'success' : 'processing'}>
                                                    {log.type.toUpperCase()}
                                                </Tag>
                                            </div>
                                            <List
                                                size="small"
                                                dataSource={log.changes}
                                                renderItem={(change) => (
                                                    <List.Item>
                                                        <ArrowRightOutlined className="mr-2 text-gray-400" />
                                                        {change}
                                                    </List.Item>
                                                )}
                                            />
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Card>
                        </motion.section>
                    </div>
                </Col>
            </Row>

            {/* Footer CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8"
            >
                <Card className="bg-gradient-to-r from-[#4335A7] to-[#6A4BAA] border-0">
                    <div className="text-center text-white">
                        <Title level={3} className="!text-white !mb-3">Ready to get started?</Title>
                        <Paragraph className="text-white/80 mb-6 max-w-2xl mx-auto">
                            Join thousands of developers building with our platform. Start your free trial today.
                        </Paragraph>
                        <Space>
                            <Button
                                size="large"
                                type="primary"
                                ghost
                                icon={<RocketOutlined />}
                                href="#getting-started"
                            >
                                Start Free Trial
                            </Button>
                            <Button
                                size="large"
                                className="bg-white text-[#4335A7] hover:bg-gray-100"
                                icon={<GithubOutlined />}
                                href="https://github.com"
                            >
                                View on GitHub
                            </Button>
                        </Space>
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}

// Missing icon component
const DatabaseOutlined = (props: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="currentColor"
        {...props}
    >
        <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.59 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm6 14c0 .62-2.69 2-6 2s-6-1.38-6-2v-3c1.25.83 3.39 1.5 6 1.5s4.75-.67 6-1.5v3zm0-5c0 .62-2.69 2-6 2s-6-1.38-6-2V9c1.25.83 3.39 1.5 6 1.5s4.75-.67 6-1.5v3zm0-5c0 .62-2.69 2-6 2s-6-1.38-6-2c0-1.66 3.58-3 8-3s8 1.34 8 3c0 .62-2.69 2-6 2s-6-1.38-6-2z" />
    </svg>
);