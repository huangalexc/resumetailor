import { FileText, Sparkles, Target } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Tailor Your Resume for Every Job
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Transform your resume to match any job description. Our AI-powered
            platform helps you highlight the right skills and experience to land
            more interviews.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/learn-more"
              className="rounded-lg px-6 py-3 text-sm font-semibold text-foreground border border-border hover:bg-accent transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Job-Specific Optimization
              </h3>
              <p className="text-sm text-muted-foreground">
                Automatically adjust your resume to match job requirements and
                highlight relevant experience.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                AI-Powered Suggestions
              </h3>
              <p className="text-sm text-muted-foreground">
                Get intelligent recommendations for keywords, skills, and
                phrasing that resonate with hiring managers.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Multiple Formats
              </h3>
              <p className="text-sm text-muted-foreground">
                Export your tailored resume in various professional formats
                ready for submission.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Resume Tailor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
