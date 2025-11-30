import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();
    const [hoveredCard, setHoveredCard] = useState(null);

    const roles = [
        {
            title: 'Customer',
            icon: '🛍️',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            description: 'Order fresh water with ease',
            path: '/customer/login',
            features: ['Quick Orders', 'Track Delivery', 'Loyalty Points']
        },
        {
            title: 'Admin',
            icon: '👨‍💼',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            description: 'Manage your business efficiently',
            path: '/admin/login',
            features: ['Dashboard', 'Analytics', 'Team Management']
        },
        {
            title: 'Delivery Worker',
            icon: '🚚',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            description: 'Handle deliveries seamlessly',
            path: '/worker/login',
            features: ['Route Optimization', 'Real-time Updates', 'Easy Navigation']
        }
    ];

    const features = [
        { icon: '⚡', title: 'Lightning Fast', desc: 'Order in seconds' },
        { icon: '🎯', title: 'Real-time Tracking', desc: 'Know exactly where your order is' },
        { icon: '💳', title: 'Secure Payments', desc: 'Multiple payment options' },
        { icon: '🎁', title: 'Loyalty Rewards', desc: 'Earn points on every order' },
        { icon: '📱', title: 'Mobile Friendly', desc: 'Order from anywhere' },
        { icon: '🔔', title: 'Smart Notifications', desc: 'Stay updated instantly' }
    ];

    const testimonials = [
        { name: 'Ahmed Khan', role: 'Regular Customer', text: 'Best water delivery service! Always on time.', rating: 5 },
        { name: 'Sara Ali', role: 'Business Owner', text: 'Reliable and professional. Highly recommended!', rating: 5 },
        { name: 'Hassan Raza', role: 'Home User', text: 'Pure water, great service. Very satisfied!', rating: 5 }
    ];

    return (
        <div
            style={{
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                minHeight: '100vh',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated Background */}
            <div
                className="pattern-dots"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    opacity: 0.3
                }}
            ></div>

            {/* Floating Circles */}
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className="float"
                    style={{
                        position: 'absolute',
                        width: `${Math.random() * 300 + 100}px`,
                        height: `${Math.random() * 300 + 100}px`,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.5}s`
                    }}
                ></div>
            ))}

            <Container style={{ position: 'relative', zIndex: 1, padding: '40px 20px' }}>
                {/* Hero Section */}
                <div className="text-center mb-5 fade-in-down">
                    <div
                        className="bounce"
                        style={{
                            fontSize: '6rem',
                            marginBottom: '20px',
                            filter: 'drop-shadow(0 10px 30px rgba(102, 126, 234, 0.5))'
                        }}
                    >
                        💧
                    </div>
                    <h1
                        style={{
                            color: 'white',
                            fontWeight: '900',
                            fontSize: '4rem',
                            marginBottom: '20px',
                            textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                            letterSpacing: '3px'
                        }}
                    >
                        AquaFlow
                    </h1>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.95)',
                            fontSize: '1.4rem',
                            fontWeight: '300',
                            letterSpacing: '2px',
                            marginBottom: '10px'
                        }}
                    >
                        Premium Water Delivery Service
                    </p>
                    <div
                        style={{
                            width: '120px',
                            height: '5px',
                            background: 'white',
                            margin: '25px auto',
                            borderRadius: '3px',
                            boxShadow: '0 5px 15px rgba(255,255,255,0.3)'
                        }}
                    ></div>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.9)',
                            fontSize: '1.15rem',
                            maxWidth: '700px',
                            margin: '0 auto 30px'
                        }}
                    >
                        Pure Water. Fast Delivery. Exceptional Service.
                    </p>

                    {/* Stats Counter */}
                    <Row className="justify-content-center mt-5 mb-4">
                        {[
                            { number: '10,000+', label: 'Happy Customers' },
                            { number: '50,000+', label: 'Deliveries Made' },
                            { number: '4.9/5', label: 'Customer Rating' }
                        ].map((stat, idx) => (
                            <Col md={4} key={idx} className="mb-3">
                                <div
                                    className="scale-in"
                                    style={{
                                        background: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '15px',
                                        padding: '25px',
                                        border: '1px solid rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <h3
                                        style={{
                                            color: 'white',
                                            fontSize: '2.5rem',
                                            fontWeight: '800',
                                            marginBottom: '5px'
                                        }}
                                    >
                                        {stat.number}
                                    </h3>
                                    <p
                                        style={{
                                            color: 'rgba(255,255,255,0.9)',
                                            margin: 0,
                                            fontSize: '0.95rem'
                                        }}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Role Selection Cards */}
                <h2
                    className="text-center mb-4 fade-in-up"
                    style={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '2.2rem'
                    }}
                >
                    Choose Your Portal
                </h2>

                <Row className="justify-content-center g-4 mb-5">
                    {roles.map((role, index) => (
                        <Col md={4} key={index}>
                            <Card
                                onClick={() => navigate(role.path)}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className="scale-in"
                                style={{
                                    borderRadius: '25px',
                                    border: 'none',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                                    cursor: 'pointer',
                                    background: 'white',
                                    transform:
                                        hoveredCard === index ? 'translateY(-15px) scale(1.03)' : 'translateY(0)',
                                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    height: '100%',
                                    overflow: 'hidden',
                                    animationDelay: `${index * 0.2}s`
                                }}
                            >
                                <div
                                    style={{
                                        background: role.color,
                                        padding: '40px 30px',
                                        textAlign: 'center',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <div
                                        className="pattern-grid"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            opacity: 0.3
                                        }}
                                    ></div>

                                    <div
                                        className={hoveredCard === index ? 'bounce' : ''}
                                        style={{
                                            fontSize: '4.5rem',
                                            marginBottom: '15px',
                                            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    >
                                        {role.icon}
                                    </div>
                                    <h3
                                        style={{
                                            color: 'white',
                                            fontWeight: '800',
                                            fontSize: '2rem',
                                            marginBottom: '10px',
                                            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    >
                                        {role.title}
                                    </h3>
                                    <p
                                        style={{
                                            color: 'rgba(255,255,255,0.95)',
                                            fontSize: '1.05rem',
                                            marginBottom: 0,
                                            position: 'relative',
                                            zIndex: 1
                                        }}
                                    >
                                        {role.description}
                                    </p>
                                </div>

                                <Card.Body style={{ padding: '30px' }}>
                                    <ul
                                        style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            margin: 0
                                        }}
                                    >
                                        {role.features.map((feature, idx) => (
                                            <li
                                                key={idx}
                                                style={{
                                                    padding: '14px 0',
                                                    borderBottom:
                                                        idx < role.features.length - 1 ? '1px solid #f0f0f0' : 'none',
                                                    color: '#555',
                                                    fontSize: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        background: role.color,
                                                        marginRight: '15px',
                                                        boxShadow: '0 3px 10px rgba(0,0,0,0.2)'
                                                    }}
                                                ></span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    <div
                                        style={{
                                            marginTop: '25px',
                                            padding: '16px',
                                            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                                            borderRadius: '12px',
                                            textAlign: 'center',
                                            fontWeight: '700',
                                            color: '#667eea',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease',
                                            border: '2px solid transparent'
                                        }}
                                    >
                                        Click to Access Portal →
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Features Section */}
                <div className="mt-5 mb-5">
                    <h2
                        className="text-center mb-5 fade-in-up"
                        style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '2.2rem'
                        }}
                    >
                        Why Choose AquaFlow?
                    </h2>
                    <Row className="g-4">
                        {features.map((feature, idx) => (
                            <Col md={4} key={idx}>
                                <div
                                    className="glass-effect scale-in"
                                    style={{
                                        padding: '30px',
                                        borderRadius: '20px',
                                        textAlign: 'center',
                                        height: '100%',
                                        animationDelay: `${idx * 0.1}s`,
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-10px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    <div
                                        style={{
                                            fontSize: '3.5rem',
                                            marginBottom: '20px'
                                        }}
                                        className="float"
                                    >
                                        {feature.icon}
                                    </div>
                                    <h4
                                        style={{
                                            color: 'white',
                                            fontWeight: '700',
                                            marginBottom: '10px'
                                        }}
                                    >
                                        {feature.title}
                                    </h4>
                                    <p
                                        style={{
                                            color: 'rgba(255,255,255,0.9)',
                                            margin: 0
                                        }}
                                    >
                                        {feature.desc}
                                    </p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Become a Rider Section */}
                <div className="mt-5 mb-5">
                    <div
                        className="glass-effect fade-in-up"
                        style={{
                            padding: '40px 30px',
                            borderRadius: '25px',
                            maxWidth: '900px',
                            margin: '0 auto',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: '20px'
                        }}
                    >
                        <div style={{ flex: '1 1 300px' }}>
                            <h2
                                style={{
                                    color: 'white',
                                    fontWeight: '800',
                                    fontSize: '2.2rem',
                                    marginBottom: '10px'
                                }}
                            >
                                Become a Rider at AquaFlow
                            </h2>
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: '1.05rem',
                                    marginBottom: '15px'
                                }}
                            >
                                Earn money by delivering water to customers in your area. Flexible hours, weekly
                                payouts, and fair compensation.
                            </p>
                            <ul
                                style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    paddingLeft: '18px',
                                    marginBottom: '15px',
                                    fontSize: '0.95rem'
                                }}
                            >
                                <li>Rs 20 per bottle delivered (per successful delivery).</li>
                                <li>Extra bonuses for peak hours and high performance.</li>
                                <li>Track your earnings and deliveries in the worker app.</li>
                            </ul>
                            <p
                                style={{
                                    color: 'rgba(255,255,255,0.9)',
                                    fontSize: '0.95rem',
                                    marginBottom: '15px'
                                }}
                            >
                                Example: Deliver 50 bottles in a day → earn Rs 1,000 for that day.
                            </p>
                            <Button
                                onClick={() => navigate('/worker/register')}
                                style={{
                                    padding: '14px 35px',
                                    borderRadius: '12px',
                                    fontWeight: '700',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                    color: 'white'
                                }}
                            >
                                Start as Rider →
                            </Button>
                        </div>
                        <div
                            style={{
                                flex: '1 1 250px',
                                textAlign: 'center'
                            }}
                        >
                            <div
                                className="glass-effect"
                                style={{
                                    borderRadius: '20px',
                                    padding: '25px',
                                    background: 'rgba(0,0,0,0.15)'
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: '4rem',
                                        marginBottom: '15px'
                                    }}
                                >
                                    🚚
                                </div>
                                <h4
                                    style={{
                                        color: 'white',
                                        fontWeight: '700',
                                        marginBottom: '10px'
                                    }}
                                >
                                    Example Earnings
                                </h4>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        marginBottom: '8px'
                                    }}
                                >
                                    25 bottles → Rs 500
                                </p>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        marginBottom: '8px'
                                    }}
                                >
                                    50 bottles → Rs 1,000
                                </p>
                                <p
                                    style={{
                                        color: 'rgba(255,255,255,0.9)',
                                        marginBottom: '0'
                                    }}
                                >
                                    100 bottles → Rs 2,000
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials */}
                <div className="mt-5 mb-5">
                    <h2
                        className="text-center mb-5 fade-in-up"
                        style={{
                            color: 'white',
                            fontWeight: '700',
                            fontSize: '2.2rem'
                        }}
                    >
                        What Our Customers Say
                    </h2>
                    <Row className="g-4">
                        {testimonials.map((testimonial, idx) => (
                            <Col md={4} key={idx}>
                                <div
                                    className="glass-effect scale-in"
                                    style={{
                                        padding: '30px',
                                        borderRadius: '20px',
                                        height: '100%',
                                        animationDelay: `${idx * 0.15}s`
                                    }}
                                >
                                    <div
                                        style={{
                                            color: '#ffd700',
                                            fontSize: '1.5rem',
                                            marginBottom: '15px'
                                        }}
                                    >
                                        {'⭐'.repeat(testimonial.rating)}
                                    </div>
                                    <p
                                        style={{
                                            color: 'white',
                                            fontSize: '1.05rem',
                                            fontStyle: 'italic',
                                            marginBottom: '20px',
                                            lineHeight: '1.6'
                                        }}
                                    >
                                        "{testimonial.text}"
                                    </p>
                                    <div>
                                        <p
                                            style={{
                                                color: 'white',
                                                fontWeight: '700',
                                                marginBottom: '5px'
                                            }}
                                        >
                                            {testimonial.name}
                                        </p>
                                        <p
                                            style={{
                                                color: 'rgba(255,255,255,0.7)',
                                                fontSize: '0.9rem',
                                                margin: 0
                                            }}
                                        >
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* CTA Section */}
                <div className="text-center mt-5 pt-4 pb-4 fade-in-up">
                    <div
                        className="glass-effect"
                        style={{
                            padding: '50px 30px',
                            borderRadius: '25px',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}
                    >
                        <h2
                            style={{
                                color: 'white',
                                fontWeight: '800',
                                fontSize: '2.5rem',
                                marginBottom: '20px'
                            }}
                        >
                            Ready to Get Started?
                        </h2>
                        <p
                            style={{
                                color: 'rgba(255,255,255,0.9)',
                                fontSize: '1.2rem',
                                marginBottom: '30px'
                            }}
                        >
                            Join thousands of satisfied customers today!
                        </p>
                        <Button
                            onClick={() => navigate('/customer/register')}
                            style={{
                                padding: '18px 50px',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                borderRadius: '15px',
                                border: 'none',
                                background: 'white',
                                color: '#667eea',
                                boxShadow: '0 10px 30px rgba(255,255,255,0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,255,255,0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 10px 30px rgba(255,255,255,0.3)';
                            }}
                        >
                            Sign Up Now →
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-5 pt-4">
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '1rem',
                            marginBottom: '10px'
                        }}
                    >
                        🏆 Trusted by 10,000+ customers nationwide
                    </p>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '0.9rem',
                            marginBottom: '20px'
                        }}
                    >
                        © 2025 AquaFlow. All rights reserved.
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            gap: '20px',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}
                    >
                        {['📱', '💬', '📧', '🌐'].map((icon, idx) => (
                            <div
                                key={idx}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: 'rgba(255,255,255,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {icon}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default LandingPage;
