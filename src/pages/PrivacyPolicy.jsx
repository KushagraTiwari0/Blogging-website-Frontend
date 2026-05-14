import React from "react";
import { SEO } from "../components";

function PrivacyPolicy() {
  return (
    <div className="page">
      <SEO 
        title="Privacy Policy" 
        description="Privacy Policy for our website" 
        url={window.location.href} 
      />
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h1 className="text-center" style={{ margin: "2rem 0" }}>Privacy Policy</h1>
            <div className="markdown-body">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2>1. Introduction</h2>
              <p>Welcome to our Privacy Policy. Your privacy is critically important to us.</p>
              
              <h2>2. Information We Collect</h2>
              <p>We only collect information about you if we have a reason to do so, for example, to provide our Services, to communicate with you, or to make our Services better.</p>

              <h2>3. How We Use Information</h2>
              <p>We use the information we collect in various ways, including to:</p>
              <ul>
                <li>Provide, operate, and maintain our website</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                <li>Send you emails</li>
                <li>Find and prevent fraud</li>
              </ul>

              <h2>4. Log Files</h2>
              <p>We follow a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>

              <h2>5. Contact Us</h2>
              <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
