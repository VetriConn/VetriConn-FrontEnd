/**
 * Button Component Examples
 * 
 * This file demonstrates the usage of the responsive Button component.
 * The Button component implements mobile-first responsive design patterns:
 * - Touch target compliance (min 44px height)
 * - Responsive padding: px-4 py-2 on mobile, px-6 py-3 on desktop
 * - Responsive text sizing: text-sm on mobile, text-base on desktop
 * - Full width on mobile, auto width on desktop (by default)
 */

import React from "react";
import { Button } from "./Button";
import { HiOutlineBriefcase, HiOutlineArrowRight } from "react-icons/hi2";

export default function ButtonExamples() {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Button Component Examples</h1>

        {/* Variants */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small Button</Button>
            <Button size="md">Medium Button</Button>
            <Button size="lg">Large Button</Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">With Icons</h2>
          <div className="flex flex-wrap gap-4">
            <Button leftIcon={<HiOutlineBriefcase className="w-5 h-5" />}>
              Find Jobs
            </Button>
            <Button
              variant="outline"
              rightIcon={<HiOutlineArrowRight className="w-5 h-5" />}
            >
              Continue
            </Button>
            <Button
              variant="secondary"
              leftIcon={<HiOutlineBriefcase className="w-5 h-5" />}
              rightIcon={<HiOutlineArrowRight className="w-5 h-5" />}
            >
              Get Started
            </Button>
          </div>
        </section>

        {/* States */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">States</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
          </div>
        </section>

        {/* Full Width */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">Full Width</h2>
          <div className="space-y-4">
            <Button fullWidth>Full Width Button</Button>
            <Button fullWidth variant="outline">
              Full Width Outline
            </Button>
          </div>
        </section>

        {/* Responsive Behavior Demo */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">Responsive Behavior</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-900 mb-3">
                <strong>Mobile (default):</strong> Full width, px-4 py-2, text-sm
              </p>
              <Button>Resize window to see changes</Button>
            </div>
            <div className="p-4 bg-green-50 rounded border border-green-200">
              <p className="text-sm text-green-900 mb-3">
                <strong>Desktop (md: breakpoint):</strong> Auto width, px-6 py-3, text-base
              </p>
              <Button>Resize window to see changes</Button>
            </div>
          </div>
        </section>

        {/* Usage Examples */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl md:text-3xl font-semibold mb-4">Common Usage Patterns</h2>
          
          {/* Form Actions */}
          <div className="mb-6">
            <h3 className="text-lg md:text-2xl font-medium mb-3">Form Actions</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mb-6">
            <h3 className="text-lg md:text-2xl font-medium mb-3">Call to Action</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <Button
                size="lg"
                leftIcon={<HiOutlineBriefcase className="w-6 h-6" />}
              >
                Browse Jobs
              </Button>
              <Button
                size="lg"
                variant="outline"
                rightIcon={<HiOutlineArrowRight className="w-6 h-6" />}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
