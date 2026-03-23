import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_250)]">
      <Navbar />
      
      <div className="container py-24 max-w-4xl">
        <div className="bg-[oklch(0.12_0.03_250)] rounded-2xl p-8 md:p-12 shadow-2xl border border-white/5">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms and Conditions</h1>
          <p className="text-white/50 text-sm mb-8">Last Updated: March 23, 2026</p>
          
          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Introduction and Acceptance of the Terms of Use</h2>
              <p>
                These Terms of Use are entered into by and between You and <strong>USM Investing Group, Inc. dba Comprando América</strong>, a for-profit corporation of the State of Texas. The following Terms of Use, together with any documents they expressly incorporate by reference (collectively, the "Terms"), govern your access to and use of this Website, including any content, functionality, and services offered on or through the Website, whether as a guest or a registered user.
              </p>
              <p>
                Please read these Terms along with our <Link href="/privacidad" className="text-primary hover:underline">Privacy Policy</Link> and <Link href="/disclaimers" className="text-primary hover:underline">Disclaimers</Link> carefully and in full before using this Website, as they contain very important information about your legal rights and obligations, including limitations of your rights and exclusions that may apply to you. These Terms set forth legally binding terms and conditions for the use of the Website.
              </p>
              <p>
                This Website is offered and available to users who are 18 years of age or older and reside in the United States or any of its territories or possessions. By using this Website, you represent and warrant that you are of legal age to form a binding contract with USM Investing Group, Inc. dba Comprando América, and meet all of the foregoing eligibility requirements. If you do not meet all of these requirements, you must not access or use the Website.
              </p>
              <p className="font-semibold text-white">
                By using the Website or by clicking to accept or agree to these Terms when this option is made available to you, you accept and agree to be bound and abide by these Terms and the aforementioned Policies and Disclaimers, incorporated herein by reference. If you do not want to agree to these Terms or the Privacy Policy, you must not access or use the Website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">1. Interpretation and Definitions</h2>
              <h3 className="text-xl font-semibold text-white/90 mb-2">Interpretation</h3>
              <p>
                The words of which the initial letter is capitalized have meanings defined under the conditions specified in the 'Definitions' section. The following definitions shall have the same meaning regardless of whether they appear in singular or plural.
              </p>
              
              <h3 className="text-xl font-semibold text-white/90 mb-2 mt-4">Definitions</h3>
              <p>For the purposes of these Terms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Company</strong> (referred to as either "USM Investing Group, Inc. dba Comprando América", "Comprando América", "the Company", "We", "Us", or "Our" in these Terms) refers to USM Investing Group, Inc. dba Comprando América, a corporation of the State of Texas.</li>
                <li><strong>You</strong> or <strong>User(s)</strong> means the individual(s) accessing this Website, the Service, or the Company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                <li><strong>Website</strong> or <strong>Site</strong> refers to the website: <a href="https://comprandoamerica.com" className="text-primary hover:underline">https://comprandoamerica.com</a>, and all of its affiliated pages, Policies, and Disclaimers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">2. Changes to the Terms of Use</h2>
              <p>
                We may revise and update these Terms from time to time at our sole discretion. All changes are effective immediately when we post them. However, any changes to the dispute resolution provisions set forth in <strong>Governing Law and Jurisdiction</strong> below will not apply to any disputes for which the parties have actual notice on or before the date the change is posted on the Website.
              </p>
              <p>
                Your continued use of the Website following the posting of the revised Terms means that you accept and agree to the changes. You are expected to check this page from time to time so you are aware of any changes, as they are binding on you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">3. Accessing the Website and Account Security</h2>
              <p>
                We reserve the right to withdraw or amend this Website and any service or material we provide on the Website, in our sole discretion, without notice. We will not be liable if, for any reason, all or any part of the Website is unavailable at any time or for any period. From time to time, we may restrict access to some parts of the Website, or the entire Website, to users, including registered users.
              </p>
              <p>You are responsible for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Making all arrangements necessary for you to have access to the Website</li>
                <li>Ensuring that all persons who access the Website through your internet connection are aware of these Terms and comply with them.</li>
              </ul>
              <p>
                To access the Website or some of the resources it offers, you may be asked to provide certain registration details or other information. It is a condition of your use of the Website that all the information you provide on the Website is correct, current, and complete. You agree that all information you provide to register with this Website or otherwise, including, but not limited to, through the use of any interactive features on the Website, is governed by our <Link href="/privacidad" className="text-primary hover:underline">Privacy Policy</Link>, and you consent to all actions we take with respect to your information consistent with our Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">4. Intellectual Property Rights</h2>
              <p>
                This Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video and audio, and the design, selection, and arrangement thereof), are owned by Company, its licensors or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secrets, and other intellectual property or proprietary rights laws.
              </p>
              <p>
                These Terms permit you to use the Website for your personal, non-commercial use only. You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Website without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">5. Trademarks</h2>
              <p>
                "Comprando América", "USM Investing Group, Inc.", the Company logo, and all related names, logos, product and service names, designs, and slogans are trademarks of Company or its affiliates or licensors. You must not use such marks without the prior written permission of Company. All other names, logos, product and service names, designs, and slogans on this Website are the trademarks of their respective owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">6. Prohibited Uses</h2>
              <p>You may use the Website only for lawful purposes and in accordance with these Terms. You agree not to use the Website:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
                <li>To impersonate or attempt to impersonate Company, a Company employee, another user, or any other person or entity.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Website, or which, as determined by us, may harm Company or users of the Website, or expose them to liability.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">7. User Contributions</h2>
              <p>
                The Website may contain chat prompts, message boards, chat rooms, personal web pages or profiles, forums, bulletin boards, and other interactive features (collectively, "Interactive Services") that allow users to post, submit, publish, display, or transmit to other users or other persons (hereinafter, "post") content or materials (collectively, "User Contributions") on or through the Website.
              </p>
              <p>
                All User Contributions must comply with applicable laws and our Content Standards. Any User Contribution you post or provide to the Website will be considered non-confidential and non-proprietary. By providing any User Contribution on the Website, you grant us and our licensees, successors, and assigns the right to use, reproduce, modify, perform, display, distribute, and otherwise disclose to third parties any such material for any purpose.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">8. Disclaimer of Warranties</h2>
              <p className="uppercase font-semibold text-white">
                Your use of the website, its content, and any services or items obtained through the website is at your own risk. The website, its content, and any services or items obtained through the website are provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied.
              </p>
              <p>
                Company hereby disclaims all warranties of any kind, whether express or implied, statutory or otherwise, including but not limited to any warranties of merchantability, non-infringement, and fitness for a particular purpose.
              </p>
              <p>
                The foregoing does not affect any warranties that cannot be excluded or limited under applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">9. Limitation on Liability</h2>
              <p className="uppercase font-semibold text-white">
                To the fullest extent provided by law, in no event will company, its affiliates or their licensors, service providers, employees, agents, officers or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the website, any websites linked to it, any content on the website or such other websites or any services or items obtained through the website or such other websites, including any direct, indirect, special, incidental, consequential or punitive damages.
              </p>
              <p>
                The foregoing does not affect any liability that cannot be excluded or limited under applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">10. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless Company, its affiliates, licensors, and service providers, and its respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Website, including, but not limited to, your User Contributions, any use of the Website's content, services and products other than as expressly authorized in these Terms, or your use of any information obtained from the Website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">11. Governing Law and Jurisdiction</h2>
              <p>
                All matters relating to the Website and these Terms, and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the internal laws of the State of Texas, without giving effect to any choice or conflict of law provision or rule.
              </p>
              <p>
                Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Website shall be instituted exclusively in the courts of Harris County, Texas, although we retain the right to bring any suit, action or proceeding against you for breach of these Terms in your country of residence or any other relevant country. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">12. Severability</h2>
              <p>
                If any provision of these Terms or their accompanying Privacy Policy or Disclaimers is held by a court or other tribunal of competent jurisdiction to be invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms will continue in full force and effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">13. Entire Agreement</h2>
              <p>
                The Terms, our <Link href="/privacidad" className="text-primary hover:underline">Privacy Policy</Link>, and <Link href="/disclaimers" className="text-primary hover:underline">Disclaimers</Link> constitute the sole and entire agreement between you and Company with respect to the Website and supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, with respect to the Website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">14. Contact Information</h2>
              <p>
                We welcome your questions, comments, and concerns about these Terms and our accompanying Policies and Disclaimers. You can reach us at <a href="mailto:info@comprandoamerica.com" className="text-primary hover:underline">info@comprandoamerica.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
