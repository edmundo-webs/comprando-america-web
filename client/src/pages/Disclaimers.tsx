import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function Disclaimers() {
  return (
    <div className="min-h-screen bg-[oklch(0.08_0.02_250)]">
      <Navbar />
      
      <div className="container py-24 max-w-4xl">
        <div className="bg-[oklch(0.12_0.03_250)] rounded-2xl p-8 md:p-12 shadow-2xl border border-white/5">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Website Disclaimers</h1>
          <p className="text-white/50 text-sm mb-8">Last Updated: March 23, 2026</p>
          
          <div className="prose prose-invert prose-sm max-w-none space-y-6 text-white/70">
            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Interpretation and Definitions</h2>
              <h3 className="text-xl font-semibold text-white/90 mb-2">Interpretation</h3>
              <p>
                The words whose initial letter is capitalized have meanings defined under the conditions specified in the 'Definitions' section. The following definitions shall have the same meaning regardless of whether they appear in the singular or plural.
              </p>
              
              <h3 className="text-xl font-semibold text-white/90 mb-2 mt-4">Definitions</h3>
              <p>For the purposes of these Terms:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Company</strong> (referred to as either "USM Investing Group, Inc. dba Comprando América", "Comprando América", "the Company", "We", "Us", or "Our" in these Terms) refers to USM Investing Group, Inc. dba Comprando América, a corporation of the State of Texas.</li>
                <li><strong>You</strong> or <strong>User(s)</strong> means the individual(s) accessing this Website, the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                <li><strong>Website or Site</strong> refers to the website: <a href="https://comprandoamerica.com" className="text-primary hover:underline">https://comprandoamerica.com</a>, and all of its affiliated pages, policies, and disclaimers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Privacy and Cookie Policies</h2>
              <p>
                Please read our <Link href="/privacidad" className="text-primary hover:underline">Privacy Policy and Cookie Policy</Link>, which are jointly available on our Website, and which also govern your use of Our services. The Cookie Policy discloses and outlines our use of cookies on the Website. This Policy explains what cookies are, the types of cookies used, how they work, why they are used on our Website, third-party cookie use, and how users can provide or deny consent to the use of cookies.
              </p>
              <p>
                The Privacy Policy informs users of how our Website collects, uses, shares, and protects personal information. It outlines the types of personal data collected, the purpose of such collection, our compliance with legal requirements, the rights users have regarding their personal information, and how users may exercise their rights.
              </p>
              <p>
                Our Policies may be updated from time to time to reflect changes in law, usage, and company policy. Users will be informed of these changes here on this Page and are encouraged to review our Policies periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Terms of Use</h2>
              <p>
                Please read our <Link href="/terminos" className="text-primary hover:underline">Terms of Use</Link> (the "Terms"), which are separately available on our Website, and which also govern your use of Our services. These Terms explain the agreements made between users and Us, outline the rights and responsibilities of both Parties, establish the rules of engagement for using our Website, include and explain disclaimers and limitations of liability which may impact a user's legal rights, and specify the jurisdiction and governing law applicable to any disputes arising from the use of our Website.
              </p>
              <p>
                Our Terms may be updated from time to time to reflect changes in law, usage, and company policy. Users will be informed of these changes here on this Page and are encouraged to review our Policies periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Educational Content Disclaimer</h2>
              <p>
                The Company provides educational content, courses, podcasts, membership programs, and advisory services related to real estate investment, business expansion, financial strategies, visa programs, and entrepreneurship in the United States. <strong>All content provided on this Website is for informational and educational purposes only and does not constitute professional financial, legal, immigration, tax, or investment advice.</strong>
              </p>
              <p>
                Any descriptions of past investments, testimonials, case studies, or success stories are for illustrative purposes only and do not represent a promise or guarantee of future results. Investment outcomes depend on numerous factors outside of Our control, including market conditions, individual circumstances, effort, timing, economic factors, and regulatory changes.
              </p>
              <p>
                <strong>You are solely responsible for your own investment decisions.</strong> Before making any financial, legal, or immigration-related decisions, you should consult with qualified professionals including financial advisors, attorneys, immigration specialists, and tax accountants who are licensed in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">No Guarantee of Results</h2>
              <p>
                The Company makes no guarantees about the results of its educational programs, membership services, advisory sessions, or any other services. While we strive to provide high-quality, accurate, and current information, <strong>we do not warrant or guarantee any specific outcome, financial gain, visa approval, successful business acquisition, or investment return.</strong>
              </p>
              <p>
                Investment in real estate, business ventures, and international expansion carries inherent risks. Past performance is not indicative of future results. Market conditions, economic factors, legal requirements, and personal circumstances vary widely and may significantly impact your outcomes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Real Estate Investment Disclaimer</h2>
              <p>
                Information provided regarding real estate investments in the United States is general in nature and does not constitute specific investment advice. Real estate investments involve significant risk, including the potential loss of principal. Property values can fluctuate based on market conditions, location, economic factors, and numerous other variables.
              </p>
              <p>
                <strong>We are not registered real estate brokers or investment advisors.</strong> All real estate transactions should be conducted through licensed real estate professionals and reviewed by qualified legal counsel. Property-specific due diligence, inspections, title searches, and financial analysis are essential before making any purchase decision.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Immigration and Visa Disclaimer</h2>
              <p>
                Information provided regarding E-2 investor visas, business formation, and immigration matters is general in nature and does not constitute legal or immigration advice. <strong>We are not immigration attorneys or licensed immigration consultants.</strong>
              </p>
              <p>
                Immigration laws and visa requirements are complex, subject to change, and vary based on individual circumstances, country of origin, and other factors. Visa approval is not guaranteed and depends on numerous factors including but not limited to: investment amount, business plan quality, source of funds documentation, treaty country eligibility, and USCIS discretion.
              </p>
              <p>
                <strong>You must consult with a qualified immigration attorney</strong> before making any decisions or investments related to visa applications or immigration status.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Tax and Legal Disclaimer</h2>
              <p>
                Information provided on this Website regarding LLC formation, business structures, tax implications, and legal matters is general in nature and does not constitute tax or legal advice. <strong>We are not attorneys or certified public accountants (CPAs).</strong>
              </p>
              <p>
                Tax laws, business regulations, and legal requirements are complex, vary by jurisdiction, and are subject to change. The tax and legal implications of business formation, real estate investment, and international business activities depend on your specific circumstances.
              </p>
              <p>
                <strong>You must consult with qualified legal and tax professionals</strong> before making any business formation, investment, or tax-related decisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Membership and Pricing</h2>
              <p>
                All membership prices, course fees, advisory session rates, promotions, and program offerings displayed on the Website are subject to change without notice. Any quote, estimate, or pricing information provided through the Website is non-binding until an order is expressly confirmed by the Company in writing.
              </p>
              <p>
                Membership benefits, course content, and program features may be modified, updated, or discontinued at any time at the Company's sole discretion. Access to certain content may require active membership status and payment of applicable fees.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Third-Party Endorsement Disclaimer</h2>
              <p>
                This website may contain references to third-party products, services, websites, professionals, or information. Any such references are provided for your convenience and do not constitute or imply an endorsement, sponsorship, or recommendation by Company of the third party, the third-party information, product, or service.
              </p>
              <p>
                We are not responsible for the accuracy, reliability, or content of third-party websites, services, or information. Your use of third-party services or websites is at your own risk and subject to their respective terms and conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">External Links Disclaimer</h2>
              <p>
                Our Website may contain links to advertisements or external websites that are not provided, maintained by, or in any way affiliated with the Company. Please note that Company does not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external Websites.
              </p>
              <p>
                The inclusion of a hyperlink to external sites does not imply affiliation, endorsement, or adoption by Company of the external site or any information contained therein.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Social Media Disclaimer</h2>
              <p>
                Content shared by Comprando América and its staff, contractors, agents, or representatives on social media platforms (including but not limited to Facebook, Instagram, YouTube, LinkedIn, TikTok, Twitter/X) is for informational and educational purposes only. It is not intended to provide professional financial, legal, immigration, or investment advice and should not be relied on in that way.
              </p>
              <p>
                We may request testimonials and reviews from members and clients regarding their experiences with our services and programs. Testimonials and reviews featured on our channels reflect the personal experiences and opinions of individual clients. Results may vary, and past outcomes do not guarantee future results.
              </p>
              <p>
                From time to time, we may share or repost content from other companies, groups, or individuals. Such sharing does not constitute an endorsement or guarantee any of their products, services, or opinions. We are not responsible for the content, claims, or representations made by third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Copyright Disclaimer</h2>
              <p>
                All content included on this website, such as text, graphics, logos, images, audio clips, video clips, software, course materials, and other materials (collectively, "Content") belongs solely to Company and may not be used, published, or distributed without the explicit, written agreement of Us.
              </p>
              <p>
                Unauthorized reproduction, distribution, or use of any Content from this Website may violate copyright, trademark, and other laws and may result in legal action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-3">Questions?</h2>
              <p>
                If you have any questions or concerns about these Disclaimers, you may contact us at <a href="mailto:info@comprandoamerica.com" className="text-primary hover:underline">info@comprandoamerica.com</a>.
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
