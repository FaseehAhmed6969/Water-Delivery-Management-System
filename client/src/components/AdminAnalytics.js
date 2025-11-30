import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

function AdminAnalytics({ darkMode }) {
    // Sample data - Replace with real data from your backend
    const revenueData = [
        { date: 'Nov 24', revenue: 2400, orders: 12 },
        { date: 'Nov 25', revenue: 3200, orders: 18 },
        { date: 'Nov 26', revenue: 2800, orders: 15 },
        { date: 'Nov 27', revenue: 4100, orders: 22 },
        { date: 'Nov 28', revenue: 3600, orders: 19 },
        { date: 'Nov 29', revenue: 4500, orders: 25 },
        { date: 'Nov 30', revenue: 5200, orders: 28 }
    ];

    const orderStatusData = [
        { name: 'Delivered', value: 156, color: '#28a745' },
        { name: 'In Transit', value: 45, color: '#007bff' },
        { name: 'Pending', value: 23, color: '#ffc107' },
        { name: 'Cancelled', value: 8, color: '#dc3545' }
    ];

    const workerPerformanceData = [
        { name: 'Ali', delivered: 45, rating: 4.8 },
        { name: 'Ahmed', delivered: 38, rating: 4.6 },
        { name: 'Hassan', delivered: 42, rating: 4.9 },
        { name: 'Usman', delivered: 35, rating: 4.5 },
        { name: 'Bilal', delivered: 40, rating: 4.7 }
    ];

    const bottleSalesData = [
        { size: '5L', sales: 320 },
        { size: '10L', sales: 450 },
        { size: '20L', sales: 280 }
    ];

    return (
        <>
            {/* Revenue Trend Chart */}
            <Row className="mb-4">
                <Col md={8}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">📈 Revenue Trend (Last 7 Days)</h5>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                        name="Revenue (₹)"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#82ca9d"
                                        strokeWidth={2}
                                        name="Orders"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">📊 Order Status</h5>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={entry => `${entry.name}: ${entry.value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Worker Performance Chart */}
            <Row className="mb-4">
                <Col md={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">👷 Worker Performance</h5>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={workerPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="delivered" fill="#8884d8" name="Deliveries" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white">
                            <h5 className="mb-0">🧴 Bottle Sales by Size</h5>
                        </Card.Header>
                        <Card.Body>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={bottleSalesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="size" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="sales" fill="#82ca9d" name="Units Sold" />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default AdminAnalytics;
