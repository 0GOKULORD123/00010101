import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Shield, AlertTriangle, Cookie, Scale, X } from 'lucide-react';

interface LegalDocument {
  id: string;
  title: string;
  icon: any;
  content: JSX.Element;
}

const legalDocuments: LegalDocument[] = [
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: Shield,
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 mb-4">Effective Date: February 3, 2026</p>
        
        <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Information We Collect</h3>
        <p className="text-white/70 mb-4">
          GROK AI ("we," "our," or "us") collects information necessary to provide automated cryptocurrency trading services. This includes:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Wallet addresses and transaction data for trading execution</li>
          <li>Account verification information as required by applicable regulations</li>
          <li>Device information, IP addresses, and usage analytics</li>
          <li>Communication records with our support team</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">2. How We Use Your Information</h3>
        <p className="text-white/70 mb-4">Your information is used exclusively for:</p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Executing automated trading strategies on your behalf</li>
          <li>Maintaining security and preventing fraudulent activities</li>
          <li>Complying with legal and regulatory obligations</li>
          <li>Improving our AI trading algorithms and platform performance</li>
          <li>Communicating important account updates and trading results</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Data Security</h3>
        <p className="text-white/70 mb-4">
          We implement industry-standard security measures including end-to-end encryption, multi-factor authentication, and regular security audits. All trading data is stored in secure, geographically distributed servers with redundant backups.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">4. Third-Party Disclosure</h3>
        <p className="text-white/70 mb-4">
          We do not sell or rent your personal information. Data may be shared only with:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Cryptocurrency exchanges necessary for trade execution</li>
          <li>Regulatory authorities when legally required</li>
          <li>Service providers under strict confidentiality agreements</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">5. Your Rights</h3>
        <p className="text-white/70 mb-4">
          You have the right to access, correct, or delete your personal data. You may withdraw consent for data processing at any time by contacting support@grokai.com. Please note that data deletion may impact our ability to provide services.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">6. Data Retention</h3>
        <p className="text-white/70 mb-4">
          We retain your data for as long as your account is active and for a minimum of seven years after account closure to comply with financial regulations and tax requirements.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">7. International Transfers</h3>
        <p className="text-white/70 mb-4">
          Your data may be processed in countries outside your residence. We ensure appropriate safeguards are in place through standard contractual clauses and compliance with GDPR, CCPA, and other applicable privacy frameworks.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">8. Contact Information</h3>
        <p className="text-white/70">
          For privacy-related inquiries, contact our Data Protection Officer at privacy@grokai.com or write to us at GROK AI Privacy Department, 1 Tesla Road, Austin, TX 78725.
        </p>
      </div>
    ),
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    icon: FileText,
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 mb-4">Effective Date: February 3, 2026</p>
        
        <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Acceptance of Terms</h3>
        <p className="text-white/70 mb-4">
          By accessing or using GROK AI's automated trading platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">2. Service Description</h3>
        <p className="text-white/70 mb-4">
          GROK AI provides an automated cryptocurrency trading platform utilizing artificial intelligence and machine learning algorithms. Our service executes trades on your behalf based on market analysis and pre-defined strategies.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Eligibility Requirements</h3>
        <p className="text-white/70 mb-4">You must:</p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Be at least 18 years of age or the legal age in your jurisdiction</li>
          <li>Have the legal capacity to enter into binding contracts</li>
          <li>Not be located in a restricted jurisdiction (including but not limited to: North Korea, Iran, Syria, Cuba)</li>
          <li>Comply with all applicable laws regarding cryptocurrency trading</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">4. Account Registration</h3>
        <p className="text-white/70 mb-4">
          You are responsible for maintaining the confidentiality of your account credentials. All activities under your account are your sole responsibility. We reserve the right to suspend or terminate accounts suspected of unauthorized use or fraudulent activity.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">5. Investment Tiers and Fees</h3>
        <p className="text-white/70 mb-4">
          Investment tiers range from $50,000 to $1,000,000. A performance fee of 20% is charged on realized profits. There are no upfront fees, subscription charges, or management fees. Fees are only applied to profitable trades.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">6. Trading Period and Withdrawals</h3>
        <p className="text-white/70 mb-4">
          Initial deposits are subject to a minimum trading period of 30 days to allow AI algorithms to execute optimal strategies. After this period, you may withdraw funds at any time with 48-hour processing notice.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">7. No Guaranteed Returns</h3>
        <p className="text-white/70 mb-4">
          While our AI systems are designed to maximize profitability, cryptocurrency markets are inherently volatile. We make no guarantees regarding investment returns. Past performance does not indicate future results.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">8. Limitation of Liability</h3>
        <p className="text-white/70 mb-4">
          GROK AI shall not be liable for losses resulting from market volatility, exchange failures, network issues, or force majeure events. Our maximum liability is limited to the fees paid to us in the preceding 12 months.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">9. Intellectual Property</h3>
        <p className="text-white/70 mb-4">
          All AI algorithms, trading strategies, platform code, and proprietary technology remain the exclusive property of GROK AI. Reverse engineering or unauthorized access attempts are strictly prohibited.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">10. Governing Law</h3>
        <p className="text-white/70 mb-4">
          These Terms are governed by the laws of the State of Delaware, United States. Disputes will be resolved through binding arbitration in accordance with JAMS rules.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">11. Modifications</h3>
        <p className="text-white/70">
          We reserve the right to modify these Terms at any time. Material changes will be communicated via email 30 days prior to taking effect. Continued use of the platform constitutes acceptance of modified Terms.
        </p>
      </div>
    ),
  },
  {
    id: 'risk',
    title: 'Risk Disclosure',
    icon: AlertTriangle,
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 mb-4">Effective Date: February 3, 2026</p>
        
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 font-bold mb-2">⚠️ HIGH RISK WARNING</p>
          <p className="text-white/70">
            Cryptocurrency trading carries substantial risk of loss. Only invest funds you can afford to lose entirely.
          </p>
        </div>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Market Volatility Risk</h3>
        <p className="text-white/70 mb-4">
          Cryptocurrency markets experience extreme price volatility. Asset values can fluctuate dramatically within minutes, potentially resulting in significant losses. Historical volatility patterns are not predictive of future movements.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">2. Technology and AI Risk</h3>
        <p className="text-white/70 mb-4">
          Our AI trading algorithms are based on historical data and mathematical models. They may not accurately predict future market conditions, black swan events, or unprecedented market scenarios. Algorithm performance can degrade during extreme market stress.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Liquidity Risk</h3>
        <p className="text-white/70 mb-4">
          During periods of market stress, cryptocurrency exchanges may experience reduced liquidity, making it difficult to execute trades at desired prices or exit positions promptly. This can result in slippage and increased losses.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">4. Exchange and Counterparty Risk</h3>
        <p className="text-white/70 mb-4">
          We execute trades on third-party cryptocurrency exchanges. These exchanges may experience technical failures, security breaches, insolvency, or regulatory actions that could result in partial or total loss of funds.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">5. Regulatory Risk</h3>
        <p className="text-white/70 mb-4">
          Cryptocurrency regulation is evolving globally. New laws or regulations may restrict trading activities, impose additional compliance requirements, or render certain strategies unprofitable or illegal.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">6. Cybersecurity Risk</h3>
        <p className="text-white/70 mb-4">
          Despite robust security measures, no system is completely immune to cyberattacks, hacking attempts, or sophisticated fraud schemes. Security breaches could result in unauthorized access to accounts or theft of assets.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">7. Operational Risk</h3>
        <p className="text-white/70 mb-4">
          System failures, network outages, software bugs, or human errors may temporarily disrupt trading operations, potentially resulting in missed opportunities or unintended positions.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">8. Leverage and Margin Risk</h3>
        <p className="text-white/70 mb-4">
          Some trading strategies may employ leverage, which amplifies both gains and losses. Margin calls during volatile periods can result in forced liquidation of positions at unfavorable prices.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">9. Tax Implications</h3>
        <p className="text-white/70 mb-4">
          Cryptocurrency trading may have complex tax consequences. You are solely responsible for understanding and complying with tax obligations in your jurisdiction. We do not provide tax advice.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">10. No FDIC or SIPC Protection</h3>
        <p className="text-white/70 mb-4">
          Cryptocurrency investments are not protected by FDIC insurance, SIPC coverage, or equivalent government protections. In the event of platform failure, you may lose your entire investment with no recourse.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">Acknowledgment</h3>
        <p className="text-white/70">
          By using GROK AI, you acknowledge that you have read, understood, and accepted these risks. You confirm that you are investing with discretionary capital and have conducted your own due diligence. You should consult with qualified financial, legal, and tax advisors before making investment decisions.
        </p>
      </div>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookie Policy',
    icon: Cookie,
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 mb-4">Effective Date: February 3, 2026</p>
        
        <h3 className="text-xl font-bold text-white mt-6 mb-3">1. What Are Cookies</h3>
        <p className="text-white/70 mb-4">
          Cookies are small text files stored on your device when you visit our platform. They help us provide a secure, personalized experience and analyze platform usage patterns.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">2. Types of Cookies We Use</h3>
        
        <h4 className="text-lg font-bold text-white mt-4 mb-2">Essential Cookies (Required)</h4>
        <p className="text-white/70 mb-4">
          These cookies are necessary for platform functionality, including authentication, security, and session management. They cannot be disabled without preventing core features from working.
        </p>

        <h4 className="text-lg font-bold text-white mt-4 mb-2">Performance Cookies (Optional)</h4>
        <p className="text-white/70 mb-4">
          These cookies collect anonymous usage data to help us understand how users interact with our platform, identify performance bottlenecks, and improve AI algorithm efficiency.
        </p>

        <h4 className="text-lg font-bold text-white mt-4 mb-2">Functional Cookies (Optional)</h4>
        <p className="text-white/70 mb-4">
          These cookies remember your preferences (such as display settings, notification preferences, and dashboard configurations) to provide a personalized experience.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Third-Party Cookies</h3>
        <p className="text-white/70 mb-4">
          We may use third-party services for analytics (Google Analytics), error tracking (Sentry), and customer support (Intercom). These services may set their own cookies subject to their respective privacy policies.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">4. Managing Cookie Preferences</h3>
        <p className="text-white/70 mb-4">
          You can manage cookie preferences through your browser settings. Note that disabling essential cookies will prevent you from accessing the trading platform. To adjust optional cookies, visit our Cookie Preferences panel in your account settings.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">5. Cookie Duration</h3>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Session cookies: Deleted when you close your browser</li>
          <li>Persistent cookies: Remain for up to 12 months unless manually deleted</li>
          <li>Authentication tokens: Valid for 30 days of inactivity</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">6. Do Not Track Signals</h3>
        <p className="text-white/70 mb-4">
          Our platform respects "Do Not Track" browser signals for optional analytics cookies. However, essential cookies remain active to ensure platform security and functionality.
        </p>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">7. Updates to This Policy</h3>
        <p className="text-white/70">
          We may update this Cookie Policy periodically. Material changes will be communicated via email and platform notifications. Continued use after changes indicates acceptance of the updated policy.
        </p>
      </div>
    ),
  },
  {
    id: 'compliance',
    title: 'Compliance',
    icon: Scale,
    content: (
      <div className="prose prose-invert max-w-none">
        <p className="text-white/60 mb-4">Effective Date: February 3, 2026</p>
        
        <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Regulatory Framework</h3>
        <p className="text-white/70 mb-4">
          GROK AI operates in compliance with applicable financial regulations, including but not limited to:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Bank Secrecy Act (BSA) and Anti-Money Laundering (AML) regulations</li>
          <li>Know Your Customer (KYC) requirements under FinCEN guidance</li>
          <li>SEC regulations regarding automated trading systems</li>
          <li>CFTC regulations for commodity derivatives trading</li>
          <li>State-level money transmitter licensing where applicable</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">2. Anti-Money Laundering (AML)</h3>
        <p className="text-white/70 mb-4">
          We maintain a comprehensive AML program including:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Customer identification and verification procedures</li>
          <li>Ongoing transaction monitoring and suspicious activity reporting</li>
          <li>Screening against OFAC, UN, and EU sanctions lists</li>
          <li>Enhanced due diligence for high-risk customers and jurisdictions</li>
          <li>Regular employee training on AML compliance obligations</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Know Your Customer (KYC)</h3>
        <p className="text-white/70 mb-4">
          All users must complete identity verification before depositing funds. Required documentation includes:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Government-issued photo identification (passport, driver's license, or national ID)</li>
          <li>Proof of residential address (utility bill, bank statement, or lease agreement dated within 90 days)</li>
          <li>Source of funds declaration for investments exceeding $100,000</li>
          <li>Enhanced documentation for politically exposed persons (PEPs)</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">4. Sanctions Compliance</h3>
        <p className="text-white/70 mb-4">
          We do not provide services to individuals or entities:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Located in sanctioned jurisdictions (including North Korea, Iran, Syria, Cuba, Crimea)</li>
          <li>Appearing on OFAC SDN list or other sanctions watchlists</li>
          <li>Owned or controlled by sanctioned parties</li>
          <li>Engaged in prohibited activities under applicable sanctions programs</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">5. Data Protection Compliance</h3>
        <p className="text-white/70 mb-4">
          We comply with global data protection standards including:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>General Data Protection Regulation (GDPR) for EU users</li>
          <li>California Consumer Privacy Act (CCPA) for California residents</li>
          <li>Personal Information Protection and Electronic Documents Act (PIPEDA) for Canadian users</li>
          <li>Data localization requirements in applicable jurisdictions</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">6. Market Integrity</h3>
        <p className="text-white/70 mb-4">
          Our AI trading algorithms are designed to:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Prevent market manipulation, spoofing, and wash trading</li>
          <li>Implement pre-trade and post-trade risk controls</li>
          <li>Comply with exchange-specific trading rules and rate limits</li>
          <li>Maintain audit trails for regulatory examination</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">7. Reporting and Audits</h3>
        <p className="text-white/70 mb-4">
          We file required reports with regulatory authorities including:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Suspicious Activity Reports (SARs) within required timeframes</li>
          <li>Currency Transaction Reports (CTRs) for transactions exceeding $10,000</li>
          <li>Annual independent audits of AML/KYC programs</li>
          <li>Regular financial statements and capital adequacy reports</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">8. Customer Cooperation</h3>
        <p className="text-white/70 mb-4">
          Users must cooperate with compliance requests including:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Providing additional documentation when requested</li>
          <li>Responding promptly to verification inquiries</li>
          <li>Updating information when circumstances change</li>
          <li>Permitting account reviews and transaction audits</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">9. Enforcement Actions</h3>
        <p className="text-white/70 mb-4">
          We reserve the right to:
        </p>
        <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
          <li>Suspend or terminate accounts failing to meet compliance standards</li>
          <li>Freeze funds pending investigation of suspicious activity</li>
          <li>Report violations to appropriate law enforcement and regulatory agencies</li>
          <li>Reverse transactions that violate our terms or applicable law</li>
        </ul>

        <h3 className="text-xl font-bold text-white mt-6 mb-3">10. Contact Compliance Team</h3>
        <p className="text-white/70">
          For compliance-related questions or to report suspicious activity, contact our Compliance Officer at compliance@grokai.com or call our dedicated compliance hotline at +1-888-GROK-AML.
        </p>
      </div>
    ),
  },
];

export function LegalSection() {
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  return (
    <>
      <section id="legal" className="relative py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              Legal & Compliance
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Transparency and regulatory compliance are fundamental to our operations
            </p>
          </motion.div>

          {/* Legal Documents Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {legalDocuments.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <motion.button
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedDoc(doc)}
                  className="relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02] text-left group"
                >
                  <Icon className="w-10 h-10 text-green-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-bold text-white mb-2">{doc.title}</h3>
                  <p className="text-white/60 text-sm">Click to read full document</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Legal Document Modal */}
      <AnimatePresence>
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoc(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <selectedDoc.icon className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-bold text-white">{selectedDoc.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
                {selectedDoc.content}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
