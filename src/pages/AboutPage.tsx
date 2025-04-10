
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BookOpen, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <Layout>
      <div className="purple-gradient py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">About Campus Connect</h1>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            Your gateway to campus events, clubs, and opportunities
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Mission Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Our Mission
          </h2>
          <Card className="glass-card">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                Campus Connect is dedicated to enhancing student life by providing a centralized platform 
                for discovering events, connecting with peers, and engaging with campus activities. 
                We believe that a rich campus experience is crucial for academic success and personal growth.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card hover:shadow-xl transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full purple-gradient flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Calendar</h3>
                <p className="text-gray-600">
                  Keep track of all campus events in one place, with filters to find exactly what interests you.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover:shadow-xl transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full purple-gradient flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Building</h3>
                <p className="text-gray-600">
                  Connect with like-minded students and form meaningful relationships through shared interests.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover:shadow-xl transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full purple-gradient flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Learning Opportunities</h3>
                <p className="text-gray-600">
                  Discover workshops, seminars, and educational events to expand your knowledge and skills.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover:shadow-xl transition-all">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full purple-gradient flex items-center justify-center mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Recognition</h3>
                <p className="text-gray-600">
                  Get acknowledged for your participation and contributions to campus life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Get Involved */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Get Involved
          </h2>
          <Card className="glass-card">
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                Whether you're looking to attend events, organize activities, or simply stay informed about
                what's happening on campus, Campus Connect provides the tools and resources you need to
                make the most of your college experience.
              </p>
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="purple-gradient text-white hover:opacity-90 transition-opacity"
                >
                  Browse Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
