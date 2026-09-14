import React from 'react';
import EgLogo from './EgLogo';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] w-full flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-100 flex items-center justify-center mb-4 text-[#d00000] shadow-sm">
            <span className="material-symbols-outlined text-3xl">error_outline</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">عفواً، حدث خطأ غير متوقع</h2>
          <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
            حدث خطأ أثناء تحميل هذه الصفحة. يمكنك المحاولة مرة أخرى أو العودة إلى الواجهة الرئيسية.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-800 text-sm font-bold transition-all"
            >
              إعادة المحاولة / Try Again
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                if (window.__resetToReels) {
                  window.__resetToReels();
                } else {
                  window.location.reload();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-[#d00000] hover:bg-[#b00000] text-white text-sm font-bold transition-all shadow-sm"
            >
              الصفحة الرئيسية / Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
