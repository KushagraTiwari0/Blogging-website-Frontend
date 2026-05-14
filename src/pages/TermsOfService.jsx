import React from "react";
import { SEO } from "../components";

function TermsOfService() {
  return (
    <div className="page">
      <SEO 
        title="Terms of Service" 
        description="Terms of Service for our website" 
        url={window.location.href} 
      />
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h1 className="text-center" style={{ margin: "2rem 0" }}>Terms of Service</h1>
            <div className="markdown-body">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <h2>1. Agreement to Terms</h2>
              <p>By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to all the terms and conditions of this agreement, you may not access the website or use any services.</p>
              
              <h2>2. Intellectual Property Rights</h2>
              <p>Other than the content you own, under these Terms, we and/or our licensors own all the intellectual property rights and materials contained in this Website.</p>

              <h2>3. Restrictions</h2>
              <p>You are specifically restricted from all of the following:</p>
              <ul>
                <li>Publishing any Website material in any other media without prior consent.</li>
                <li>Selling, sublicensing and/or otherwise commercializing any Website material.</li>
                <li>Publicly performing and/or showing any Website material.</li>
                <li>Using this Website in any way that is or may be damaging to this Website.</li>
                <li>Using this Website in any way that impacts user access to this Website.</li>
              </ul>

              <h2>4. User Content</h2>
              <p>In these Website Standard Terms and Conditions, "User Content" shall mean any audio, video text, images or other material you choose to display on this Website. By displaying Your Content, you grant us a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

              <h2>5. No warranties</h2>
              <p>This Website is provided "as is," with all faults, and we express no representations or warranties, of any kind related to this Website or the materials contained on this Website.</p>

              <h2>6. Limitation of liability</h2>
              <p>In no event shall we, nor any of our officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract.</p>

              <h2>7. Changes to Terms</h2>
              <p>We are permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review these Terms on a regular basis.</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
