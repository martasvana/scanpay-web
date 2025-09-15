import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userEmail?: string;
}

export const WelcomeEmail = ({
  userEmail = 'subscriber@example.com',
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to the Unrenewed Waitlist!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://unrenewed.app/favicon/favicon-32x32.png"
            width="32"
            height="32"
            alt="Unrenewed"
            style={logo}
          />
          <Heading style={heading}>Welcome to the Unrenewed Waitlist!</Heading>
          
          <Text style={paragraph}>Hi there,</Text>
          
          <Text style={paragraph}>
            Thank you for joining the <span style={highlight}>Unrenewed waitlist</span>! 
            We're excited to have you on board as we build a solution to help you 
            take control of your subscriptions.
          </Text>
          
          <Text style={paragraph}>
            With Unrenewed, you'll never get charged for an unused subscription again. 
            Our platform will help you:
          </Text>
          
          <Section style={benefitSection}>
            <Text style={listItem}>• Track all your active subscriptions in one place</Text>
            <Text style={listItem}>• Get timely reminders before renewal dates</Text>
            <Text style={listItem}>• Cancel unwanted subscriptions with ease</Text>
            <Text style={listItem}>• Save money on services you no longer use</Text>
          </Section>
          
          <Text style={paragraph}>
            We're working hard to launch soon and will keep you updated on our progress.
            You'll be among the first to know when we're ready!
          </Text>
          
          <Text style={paragraph}>
            If you have any questions or suggestions, feel free to reach out to us.
          </Text>
          
          <Button style={{
            ...button,
            padding: '12px 20px',
          }} href="https://unrenewed.app">
            Learn More
          </Button>
          
          <Text style={paragraph}>
            Best regards,<br />The Unrenewed Team
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            ©2025 Unrenewed. All rights reserved.
          </Text>
          
          <Text style={footer}>
            If you no longer wish to receive these emails, you can{' '}
            <Link href="#" style={unsubscribeLink}>unsubscribe</Link>.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  padding: '30px 0',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '30px',
  borderRadius: '8px',
  maxWidth: '600px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
};

const logo = {
  margin: '0 auto 20px',
  display: 'block',
};

const heading = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '700',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const paragraph = {
  color: '#4c4c4c',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '16px 0',
};

const highlight = {
  color: '#8a3ffc',
  fontWeight: 'bold',
};

const benefitSection = {
  padding: '0px 16px',
  margin: '24px 0',
};

const listItem = {
  color: '#4c4c4c',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '8px 0',
};

const button = {
  backgroundColor: '#8a3ffc',
  backgroundImage: 'linear-gradient(to right, #8a3ffc, #a56eff)',
  borderRadius: '50px',
  color: '#fff',
  display: 'inline-block',
  fontWeight: '600',
  margin: '24px auto',
  textAlign: 'center' as const,
  textDecoration: 'none',
  border: '4px solid #e9d5ff',
};

const hr = {
  borderColor: '#e6e6e6',
  margin: '30px 0',
};

const footer = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const unsubscribeLink = {
  color: '#8a3ffc',
  textDecoration: 'underline',
}; 