
import React from 'react';
import Layout from '@/components/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="bg-gradient-to-r from-purple-800 to-blue-600 py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">About Campus Connect</h1>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            Your gateway to campus events, clubs, and opportunities
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700">
              Campus Connect is dedicated to enhancing student life by providing a centralized platform 
              for discovering events, connecting with peers, and engaging with campus activities. 
              We believe that a rich campus experience is crucial for academic success and personal growth.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>A comprehensive calendar of campus events and activities</li>
              <li>Tools to discover events based on your interests and schedule</li>
              <li>Opportunities to connect with like-minded students</li>
              <li>Easy registration for workshops, seminars, and social gatherings</li>
              <li>Updates on important campus announcements</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
            <p className="text-gray-700">
              Whether you're looking to attend events, organize activities, or simply stay informed about
              what's happening on campus, Campus Connect provides the tools and resources you need to
              make the most of your college experience.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
