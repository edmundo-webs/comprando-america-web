import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_250)]">
      <Navbar />
      
      <div className="container py-24 max-w-4xl">
        <div className="bg-[oklch(0.12_0.03_250)] rounded-2xl p-8 md:p-12 shadow-2xl border border-white/5">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Privacy Policy & Cookie Policy</h1>
          <p className="text-white/50 text-sm mb-8">Last Updated: March 23, 2026</p>
          
          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Introduction</h2>
              <p>
                <strong>USM Investing Group, Inc. dba Comprando América</strong>, a for-profit corporation of the State of Texas (<strong>"Company"</strong>, "Comprando América", <strong>"We", "Our"</strong>, <strong>"Us"</strong>) respects your privacy and is committed to protecting it through our compliance with this policy.
              </p>
              <p>
                This Privacy Policy (this "Privacy Policy" or this "Policy") describes the types of information we may collect from you or that you may provide when you visit the website <a href="https://comprandoamerica.com" className="text-primary hover:underline">https://comprandoamerica.com</a> (our <strong>"Website"</strong>) and our practices for collecting, using, maintaining, protecting, and disclosing that information.
              </p>
              <p>This Policy applies to information we collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>On this Website.</li>
                <li>In email, text, and other electronic messages between you and this Website.</li>
                <li>Through mobile and desktop applications you download from this Website, which provide dedicated non-browser-based interaction between you and this Website.</li>
                <li>When you interact with our advertising and applications on third-party websites and services, if those applications or advertising include links to this Policy.</li>
                <li>Through a sign-up sheet, digital form, or other clear indication that you wish to receive Our digital communications.</li>
              </ul>
              <p>
                Please read this Policy carefully to understand our policies and practices regarding your information and how we will treat it. If you do not agree with our policies and practices, your choice is not to use our Website. By accessing or using this Website, you agree to this privacy policy. This policy may change from time to time. Your continued use of this Website after we make changes is deemed to be acceptance of those changes, so please check the policy periodically for updates.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Children Under the Age of 16</h2>
              <p>
                Our Website is not intended for children under 16 years of age. No one under age 16 may provide any information to or on the Website. We do not knowingly collect personal information from children under 16. If you are under 16, do not use or provide any information on this Website or on or through any of its features. If we learn we have collected or received personal information from a child under 16 without verification of parental consent, we will delete that information. If you believe we might have any information from or about a child under 16, please contact us at:
              </p>
              <p className="font-semibold text-white">
                USM Investing Group, Inc. dba Comprando América<br />
                <a href="mailto:info@comprandoamerica.com" className="text-primary hover:underline">info@comprandoamerica.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Information We Collect About You and How We Collect It</h2>
              <p>We collect several types of information from and about users of our Website, including information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>By which you may be personally identified, such as name, postal address, e-mail address, telephone number, or any other identifier by which you may be contacted online or offline (<strong>"personal information"</strong>);</li>
                <li>That is about you, but does not individually identify you; and/or</li>
                <li>About your internet connection, the equipment you use to access our Website, and usage details.</li>
              </ul>
              <p>We collect this information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Directly from you when you provide it to us; and</li>
                <li>Automatically, as you navigate through the site. Information collected automatically may include usage details, IP addresses, and information collected through cookies, web beacons, and other tracking technologies.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Information You Provide to Us</h2>
              <p>The information we collect on or through our Website may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Information that you provide by filling in forms on our Website. This includes information provided at the time of registering to use our Website, subscribing to our service, requesting membership information, or requesting further services.</li>
                <li>Records and copies of your correspondence (including email addresses), if you contact us.</li>
                <li>Your responses to surveys that we might ask you to complete for research purposes.</li>
                <li>Details of transactions you carry out through our Website and of the fulfillment of your orders.</li>
                <li>Your search queries on the Website.</li>
              </ul>
              <p>
                Company uses industry-standard best practices to protect your Personal Information, but <strong>we cannot represent, warrant, and/or guarantee that personal information will remain secure</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Information We Collect Through Automatic Data Collection Technologies</h2>
              <p>
                As you navigate through and interact with our Website, we may use automatic data collection technologies to collect certain information about your equipment, browsing actions, and patterns, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Details of your visits to our Website, including traffic data, location data, logs, and other communication data, and the resources that you access and use on the Website.</li>
                <li>Information about your computer and internet connection, including your IP address, operating system, and browser type.</li>
              </ul>
              <p>The technologies we use for this automatic data collection may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cookies (or browser cookies).</strong> A cookie is a small file placed on the hard drive of your computer. You may refuse to accept browser cookies by activating the appropriate setting on your browser. However, if you select this setting, you may be unable to access certain parts of our Website.</li>
                <li><strong>Flash Cookies.</strong> Certain features of our Website may use local stored objects (or Flash cookies) to collect and store information about your preferences and navigation to, from, and on our Website.</li>
                <li><strong>Web Beacons.</strong> Pages of our Website and our emails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Data Breach Notification Procedure</h2>
              <p>
                In the event of a data breach that affects your personal information, we will take the following steps:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li><strong>Investigation:</strong> We will promptly investigate the nature and scope of the breach.</li>
                <li><strong>Notification:</strong> We will notify affected users via email, a notice on our Website homepage, and a written letter sent to your address on file within a reasonable timeframe as required by applicable law.</li>
                <li><strong>Content of Notice:</strong> The notice will include the date of the breach, types of information compromised, steps we are taking to address the breach, and recommended actions you should take to protect yourself.</li>
                <li><strong>Reporting to Authorities:</strong> We will report the breach to relevant authorities as required by applicable law.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">How We Use Your Information</h2>
              <p>We use information that we collect about you or that you provide to us, including any personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To present our Website and its contents to you.</li>
                <li>To provide you with information about our membership programs, courses, podcasts, and services.</li>
                <li>To fulfill any other purpose for which you provide it.</li>
                <li>To send newsletters and updates to you and Company affiliates.</li>
                <li>To provide you with notices about your account, including expiration and renewal notices.</li>
                <li>To notify you about changes to our Website or any products or services we offer or provide through it.</li>
                <li>To allow you to participate in interactive features on our Website.</li>
                <li>In any other way we may describe when you provide the information.</li>
                <li>For any other purpose with your consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Opt-Out and Unsubscribe</h2>
              <p>
                All marketing emails from Comprando América include an unsubscribe link. You may opt out of receiving promotional emails at any time by clicking the unsubscribe link in any email or by contacting us at <a href="mailto:info@comprandoamerica.com" className="text-primary hover:underline">info@comprandoamerica.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Disclosure of Your Information</h2>
              <p>We may disclose aggregated information about our users and information that does not identify any individual without restriction.</p>
              <p>We may disclose personal information that we collect, or you provide, as described in this privacy policy:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To our subsidiaries and affiliates.</li>
                <li>To contractors, service providers, and other third parties we use to support our business.</li>
                <li>To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Company's assets.</li>
                <li>To fulfill the purpose for which you provide it.</li>
                <li>For any other purpose disclosed by us when you provide the information.</li>
                <li>With your consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Communications via Website Chatbot</h2>
              <p>Our Website may offer an interactive chatbot feature to assist you and to facilitate communication with us. Your use of this chatbot is subject to the following conditions:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Recording and Monitoring.</strong> You acknowledge and agree that your conversations with the chatbot are monitored and recorded for purposes of quality assurance, customer service, training, and to improve our services.</li>
                <li><strong>Do Not Share Sensitive Information.</strong> This chatbot is not a secure channel for transmitting sensitive data. To protect your security and privacy, you must not submit any sensitive personal or financial information through the chat feature.</li>
                <li><strong>Security Disclaimer.</strong> By using the chatbot, you understand and accept the inherent risks that any information you provide may be subject to interception or unauthorized access. The Company disclaims all liability for any loss or damage you may suffer as a result of transmitting sensitive information through the chatbot.</li>
              </ul>
              <p>
                For any sensitive inquiries, please contact us directly via email at <a href="mailto:info@comprandoamerica.com" className="text-primary hover:underline">info@comprandoamerica.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Choices About How We Use and Disclose Your Information</h2>
              <p>We strive to provide you with choices regarding the personal information you provide to us. We have created mechanisms to provide you with the following control over your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Tracking Technologies and Advertising.</strong> You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. If you disable or refuse cookies, please note that some parts of this site may then be inaccessible or not function properly.</li>
                <li><strong>Promotional Offers from the Company.</strong> If you do not wish to have your contact information used by the Company to promote our own or third parties' products or services, you can opt out by sending us an email stating your request to <a href="mailto:info@comprandoamerica.com" className="text-primary hover:underline">info@comprandoamerica.com</a>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Changes to Our Privacy Policy</h2>
              <p>
                It is our policy to post any changes we make to our Privacy Policy and Cookie Policy on this page. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the Website home page. The date the Policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date, active, and deliverable email address for you, and for periodically visiting our Website and this Policy to check for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Contact Information</h2>
              <p>
                We welcome your questions, comments, and concerns about this Privacy Policy and Site. You can reach us at:
              </p>
              <p className="font-semibold text-white">
                <a href="mailto:info@comprandoamerica.com" className="text-primary hover:underline">info@comprandoamerica.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
