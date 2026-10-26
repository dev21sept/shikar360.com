import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppTab from '../components/WhatsAppTab';
import CounsellingModal from '../components/CounsellingModal';
import AuthModal from '../components/AuthModal';
import CityModal from '../components/CityModal';
import {
  Building2,
  MapPin,
  Star,
  Award,
  CheckCircle2,
  Heart,
  Share2,
  BookOpen,
  TrendingUp,
  HelpCircle,
  MessageSquare,
  Calendar,
  Send,
  X
} from 'lucide-react';
import { getCollegeBySlug, submitReview, submitApplication } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CollegeDetailPage = () => {
  const { slug } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const { wishlist, toggleWishlist, addToCompare, setCounsellingModalOpen, user, setAuthModalOpen } = useAuth();

  // Review submission state
  const [reviewForm, setReviewForm] = useState({ courseName: '', rating: 5, title: '', content: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Application (Common Application) state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyCourseId, setApplyCourseId] = useState('');
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    fetchCollege();
  }, [slug]);

  const fetchCollege = async () => {
    setLoading(true);
    const res = await getCollegeBySlug(slug);
    if (res && res.success && res.college) {
      setCollege(res.college);
    }
    setLoading(false);
  };

  const handleOpenApply = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setApplySuccess(false);
    setApplyCourseId('');
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setApplySubmitting(true);
    const res = await submitApplication({ collegeId: college.id, courseId: applyCourseId || null });
    setApplySubmitting(false);
    if (res.success) {
      setApplySuccess(true);
    } else {
      alert(res.message || 'Failed to submit application');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!reviewForm.content.trim()) return;
    setReviewSubmitting(true);
    const res = await submitReview({ collegeId: college.id, ...reviewForm });
    setReviewSubmitting(false);
    if (res.success) {
      setReviewSuccess(true);
      setReviewForm({ courseName: '', rating: 5, title: '', content: '' });
      fetchCollege();
      setTimeout(() => setReviewSuccess(false), 3000);
    } else {
      alert(res.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
          Loading institution details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">College Not Found</h2>
          <p className="text-xs text-slate-500 mb-4">The institution you are looking for does not exist or has been moved.</p>
          <Link to="/colleges" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">
            Browse All Colleges
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isWishlisted = wishlist.some(c => c.id === college.id);

  const tabs = [
    { id: 'overview', label: 'Info & Overview' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'admissions', label: 'Admission' },
    { id: 'placements', label: 'Placement' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'qna', label: 'Q&A' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-sans">
      <Header />
      <WhatsAppTab />

      {/* College Banner Header */}
      <div className="bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 p-2 shadow-sm shrink-0 overflow-hidden">
                {college.logoUrl ? (
                  <img src={college.logoUrl} alt={college.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="w-full h-full bg-blue-50 text-blue-600 font-bold text-xl flex items-center justify-center rounded-xl">
                    {college.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">{college.name}</h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    Verified Institution
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 mr-1" />
                    {college.city}, {college.state}, {college.country}
                  </span>
                  <span>•</span>
                  <span>Estd. {college.establishedYear || '2005'}</span>
                  <span>•</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium">{college.universityType}</span>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  <div className="flex items-center text-amber-500 font-bold text-xs">
                    <Star className="w-4 h-4 fill-amber-400 mr-1" />
                    <span>{college.rating || '4.5'}/5</span>
                    <span className="text-slate-400 font-normal ml-1">({college.reviewCount || '500'} Reviews)</span>
                  </div>
                  {college.nirfRanking && (
                    <span className="text-xs bg-amber-50 text-amber-800 font-semibold px-2 py-0.5 rounded border border-amber-200">
                      NIRF Ranking #{college.nirfRanking}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <button
                onClick={() => toggleWishlist(college)}
                className={`p-2.5 rounded-xl border transition-colors flex items-center justify-center ${
                  isWishlisted ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200 hover:text-red-500'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
              </button>

              <button
                onClick={() => addToCompare(college)}
                className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-[#1a56db] text-xs font-bold hover:bg-blue-100 transition-colors"
              >
                + Compare
              </button>

              <button
                onClick={handleOpenApply}
                className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-[#1a56db] hover:bg-[#1545b3] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                Apply for Admission
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 sm:space-x-6 border-t border-gray-100 mt-6 pt-3 overflow-x-auto hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id ? 'text-[#1a56db]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a56db] rounded-full" />
                )}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'overview' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-5">
                <h3 className="text-base font-bold text-slate-900">About {college.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {college.overview || 'Recognized as one of the premier institutions in India providing exceptional undergraduate and postgraduate courses.'}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-[11px] text-slate-400">Campus Type</div>
                    <div className="text-xs font-bold text-slate-800">{college.universityType}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-[11px] text-slate-400">Average CTC</div>
                    <div className="text-xs font-bold text-emerald-700">{college.averagePackage || '₹8.5 LPA'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-[11px] text-slate-400">Highest CTC</div>
                    <div className="text-xs font-bold text-blue-700">{college.highestPackage || '₹60+ LPA'}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <div className="text-[11px] text-slate-400">Approvals</div>
                    <div className="text-xs font-bold text-purple-700">UGC, NAAC A+</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Available Courses &amp; Fee Structure</h3>
                <div className="divide-y divide-gray-100">
                  {(college.collegeCourses || [
                    { id: 1, course: { name: 'B.Tech Computer Science', level: 'UG' }, duration: '4 Years', totalFee: '980000', seats: 300, averagePackage: '₹9.2 LPA' },
                    { id: 2, course: { name: 'MBA Marketing & Finance', level: 'PG' }, duration: '2 Years', totalFee: '650000', seats: 120, averagePackage: '₹8.5 LPA' },
                    { id: 3, course: { name: 'MCA Cloud Computing', level: 'PG' }, duration: '2 Years', totalFee: '320000', seats: 60, averagePackage: '₹7.2 LPA' },
                  ]).map((c, i) => (
                    <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{c.course?.name || 'Program'}</h4>
                        <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                          <span>{c.duration}</span>
                          <span>•</span>
                          <span>{c.seats || 60} Seats</span>
                          <span>•</span>
                          <span className="text-emerald-600 font-semibold">Avg: {c.averagePackage || '₹8 LPA'}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Total Course Fee</div>
                          <div className="text-sm font-bold text-[#1a56db]">₹{Number(c.totalFee || 500000).toLocaleString('en-IN')}</div>
                        </div>
                        <button
                          onClick={() => {
                            if (!user) { setAuthModalOpen(true); return; }
                            setApplySuccess(false);
                            setApplyCourseId(c.course?.id || c.courseId || '');
                            setApplyModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-[#1a56db] text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'admissions' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Admission Process 2026-2027</h3>
                <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="font-bold text-slate-800 mb-1">Step 1: Online Application Submission</p>
                    <p className="text-xs text-slate-600">Submit the Shikhar360 application form along with 10th, 12th or graduation marksheets.</p>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="font-bold text-slate-800 mb-1">Step 2: Entrance Exam / Merit Verification</p>
                    <p className="text-xs text-slate-600">Admissions are based on valid entrance test scores (JEE Main, CAT, MAT, or University Entrance Exam) or 10+2 marks.</p>
                  </div>
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="font-bold text-slate-800 mb-1">Step 3: Document Verification &amp; Seat Allotment</p>
                    <p className="text-xs text-slate-600">Document authentication and provisional seat allotment upon initial registration fee payment.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'placements' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Placement Highlights</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                    <div className="text-xl font-black text-emerald-700">{college.averagePackage || '₹8.5 LPA'}</div>
                    <div className="text-xs text-emerald-800 font-medium">Average Package</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <div className="text-xl font-black text-blue-700">{college.highestPackage || '₹61.75 LPA'}</div>
                    <div className="text-xs text-blue-800 font-medium">Highest Package</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Student Reviews &amp; Ratings ({(college.collegeReviews || []).length})</h3>

                <div className="space-y-3">
                  {(college.collegeReviews || []).length === 0 && (
                    <p className="text-xs text-slate-400">No reviews yet. Be the first to share your experience.</p>
                  )}
                  {(college.collegeReviews || []).map((r) => (
                    <div key={r.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-xs">{r.studentName}{r.courseName ? ` — ${r.courseName}` : ''}</span>
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(r.rating) ? 'fill-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      {r.title && <p className="text-xs font-semibold text-slate-700">{r.title}</p>}
                      <p className="text-xs text-slate-600 italic">"{r.content}"</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmitReview} className="pt-4 border-t border-gray-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900">
                    {user ? 'Write a Review' : 'Log in to write a review'}
                  </h4>
                  {reviewSuccess && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs font-semibold">
                      Review submitted successfully!
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                        className="cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${n <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    placeholder="Review title (optional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                  <textarea
                    rows={3}
                    required
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    placeholder="Share your experience about academics, placements, campus life..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  />
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-4 py-2 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold text-xs rounded-lg"
                  >
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'qna' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Questions &amp; Answers</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-800">Q: Does the university offer hostel accommodations for outstation students?</p>
                    <p className="text-xs text-slate-600 mt-1">A: Yes, air-conditioned and standard hostel rooms are available on campus with Wi-Fi, laundry, and dining services.</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs font-bold text-slate-800">Q: What are the scholarship criteria for merit holders?</p>
                    <p className="text-xs text-slate-600 mt-1">A: Up to 100% tuition waiver is offered for students scoring 95%+ in qualifying board examinations.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Quick Contact & Lead Capture */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Get Direct Admission Support</h4>
              <p className="text-xs text-slate-500">
                Connect with our authorized counsellors to reserve seats, review fee waivers and complete direct admissions.
              </p>

              <button
                onClick={() => setCounsellingModalOpen(true)}
                className="w-full py-3 bg-[#1a56db] hover:bg-[#1545b3] text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Request Free Call Back
              </button>

              <a
                href="https://wa.me/917428800111"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <Footer />
      <CounsellingModal />
      <AuthModal />
      <CityModal />

      {/* Common Application Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            {applySuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900">Application Submitted!</h3>
                <p className="text-xs text-slate-500">
                  Your application to {college.name} has been received. Track its status from your student dashboard.
                </p>
                <Link
                  to="/dashboard/student"
                  onClick={() => setApplyModalOpen(false)}
                  className="inline-block mt-3 px-4 py-2 bg-[#1a56db] text-white text-xs font-bold rounded-lg"
                >
                  View My Applications
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Apply to {college.name}</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Course</label>
                  <select
                    value={applyCourseId}
                    onChange={(e) => setApplyCourseId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#1a56db] focus:outline-hidden"
                  >
                    <option value="">General Enquiry (no specific course)</option>
                    {(college.collegeCourses || []).map((cc) => (
                      <option key={cc.id} value={cc.course?.id || cc.courseId}>
                        {cc.course?.name || 'Course'}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400">
                  Applying as <strong className="text-slate-700">{user?.fullName}</strong> ({user?.email}). An application number will be generated and tracked in your dashboard.
                </p>
                <button
                  type="submit"
                  disabled={applySubmitting}
                  className="w-full py-3 bg-[#1a56db] hover:bg-[#1e429f] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md"
                >
                  {applySubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeDetailPage;
