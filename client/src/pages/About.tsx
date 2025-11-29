import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-sm">
          <h1 className="text-4xl font-bold text-primary mb-6 text-center">About Krishna Electronics</h1>
          
          <div className="prose prose-lg mx-auto text-gray-600 space-y-6">
            <p className="lead text-xl text-center mb-8">
              Welcome to Krishna Electronics, your number one source for all things tech. We're dedicated to giving you the very best of electronics, with a focus on dependability, customer service, and uniqueness.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-800">Our Story</h3>
            <p>
              Founded in 2024, Krishna Electronics has come a long way from its beginnings in a home office. When we first started out, our passion for "Eco-friendly & Smart Technology" drove us to do intense research, quit our day job, and gave us the impetus to turn hard work and inspiration into to a booming online store.
            </p>
            
            <h3 className="text-2xl font-semibold text-gray-800">Our Mission</h3>
            <p>
              We now serve customers all over the world, and are thrilled to be a part of the quirky, eco-friendly, fair trade wing of the electronics industry. Our mission is to provide high-quality gadgets that enhance your lifestyle without breaking the bank.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-primary text-lg mb-2">Quality First</h4>
                <p className="text-sm">We only stock products from reputable brands that meet our strict quality standards.</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-primary text-lg mb-2">Customer Focus</h4>
                <p className="text-sm">Our support team is available 24/7 to help you with any questions or issues.</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-primary text-lg mb-2">Fast Shipping</h4>
                <p className="text-sm">We offer expedited shipping options to get your gadgets to you as fast as possible.</p>
              </div>
            </div>

            <p className="text-center italic">
              We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
            </p>
            
            <div className="text-center font-bold text-primary mt-8">
              Sincerely,<br />
              The Krishna Electronics Team
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
