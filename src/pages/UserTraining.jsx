import { useState } from 'react'
import { mockTrainingRecommendations } from '../data/userDashboardData'
import './Dashboard.css'

export default function UserTraining() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [courseProgress, setCourseProgress] = useState(
    mockTrainingRecommendations.reduce((acc, rec) => {
      acc[rec.id] = {
        completedSections: rec.completedSections,
        totalSections: rec.totalSections,
        progress: rec.progress,
      }
      return acc
    }, {})
  )

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatus = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const daysLeft = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24))
    
    if (daysLeft < 0) return { text: 'Overdue', color: '#ff6b6b' }
    if (daysLeft <= 7) return { text: `${daysLeft} days left`, color: '#ffb347' }
    return { text: `${daysLeft} days left`, color: '#4ecdc4' }
  }

  const handleContinueTraining = (course) => {
    setSelectedCourse(course)
  }

  const handleCompleteSection = (courseId, sectionIndex) => {
    setCourseProgress(prev => {
      const current = prev[courseId]
      if (sectionIndex >= current.completedSections && sectionIndex < current.totalSections) {
        const newCompleted = sectionIndex + 1
        const newProgress = Math.round((newCompleted / current.totalSections) * 100)
        return {
          ...prev,
          [courseId]: {
            ...current,
            completedSections: newCompleted,
            progress: newProgress,
          }
        }
      }
      return prev
    })
  }

  const handleCompleteCourse = (courseId) => {
    setCourseProgress(prev => {
      const current = prev[courseId]
      return {
        ...prev,
        [courseId]: {
          ...current,
          completedSections: current.totalSections,
          progress: 100,
        }
      }
    })
  }

  const handleBackToList = () => {
    setSelectedCourse(null)
  }

  if (selectedCourse) {
    const progress = courseProgress[selectedCourse.id]
    const status = getStatus(selectedCourse.deadline)

    return (
      <div className="dashboard">
        <section className="course-detail-section">
          <button className="back-btn" onClick={handleBackToList}>
            ← Back to Courses
          </button>

          <div className="course-detail-header">
            <span className="course-detail-icon">{selectedCourse.icon}</span>
            <div className="course-detail-title-group">
              <h2 className="course-detail-title">{selectedCourse.title}</h2>
              <p className="course-detail-name">{selectedCourse.course}</p>
            </div>
            <span className="course-detail-status" style={{ color: status.color }}>
              {status.text}
            </span>
          </div>

          <p className="course-detail-description">{selectedCourse.description}</p>

          <div className="course-overall-progress">
            <div className="progress-header">
              <h3>Overall Progress</h3>
              <span className="progress-percentage-large">{progress.progress}%</span>
            </div>
            <div className="progress-bar-large">
              <div
                className="progress-fill-large"
                style={{
                  width: `${progress.progress}%`,
                  background: 'linear-gradient(90deg, #00d4ff, #0099cc)',
                }}
              ></div>
            </div>
            <p className="progress-text">
              {progress.completedSections} of {progress.totalSections} sections completed
            </p>
          </div>

          <div className="course-sections-detail">
            <h3>Course Sections</h3>
            <div className="sections-detail-list">
              {selectedCourse.sections.map((section, idx) => {
                const isCompleted = idx < progress.completedSections
                const isNext = idx === progress.completedSections
                return (
                  <div key={idx} className={`section-detail-item ${isCompleted ? 'completed' : ''} ${isNext ? 'next' : ''}`}>
                    <div className="section-detail-header">
                      <div className="section-detail-number">
                        {isCompleted ? '✓' : idx + 1}
                      </div>
                      <div className="section-detail-info">
                        <h4>{section}</h4>
                        <p>{isCompleted ? 'Completed' : isNext ? 'Current Section' : 'Locked'}</p>
                      </div>
                    </div>
                    {isNext && progress.progress < 100 && (
                      <button
                        className="complete-section-btn"
                        onClick={() => handleCompleteSection(selectedCourse.id, idx)}
                      >
                        Complete Section
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="course-actions">
            {progress.progress === 100 ? (
              <button className="course-complete-btn" disabled>
                ✓ Course Completed
              </button>
            ) : (
              <button
                className="complete-course-btn"
                onClick={() => handleCompleteCourse(selectedCourse.id)}
              >
                Complete Course
              </button>
            )}
            <button className="back-btn-secondary" onClick={handleBackToList}>
              Back to Courses
            </button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <section className="dashboard__recommendations">
        <h3>Recommended Security Training</h3>
        <div className="recommendations-grid" style={{ gridTemplateColumns: '1fr' }}>
          {mockTrainingRecommendations.map((rec) => {
            const status = getStatus(rec.deadline)
            const currentProgress = courseProgress[rec.id]
            return (
              <div key={rec.id} className="training-card">
                <div className="training-header">
                  <div className="training-title-section">
                    <span className="recommendation-icon">{rec.icon}</span>
                    <div className="training-title-group">
                      <h4 className="training-main-title">{rec.title}</h4>
                      <span className="training-course-name">{rec.course}</span>
                    </div>
                  </div>
                  <span className="training-status" style={{ color: status.color }}>
                    {status.text}
                  </span>
                </div>

                <p className="training-description">{rec.description}</p>

                <div className="training-progress-section">
                  <div className="progress-info">
                    <span className="progress-label">Progress</span>
                    <div className="progress-stats">
                      <span className="sections-completed">
                        {currentProgress.completedSections} of {currentProgress.totalSections} sections
                      </span>
                      <span className="progress-percentage">{currentProgress.progress}%</span>
                    </div>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${currentProgress.progress}%`,
                          background: 'linear-gradient(90deg, #00d4ff, #0099cc)',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="training-meta">
                  <div className="meta-item">
                    <span className="meta-label">Enrolled</span>
                    <span className="meta-value">{formatDate(rec.enrolledDate)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Deadline</span>
                    <span className="meta-value">{formatDate(rec.deadline)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Est. Time</span>
                    <span className="meta-value">{rec.estimatedTime}</span>
                  </div>
                </div>

                <div className="training-sections">
                  <span className="sections-title">Course Content</span>
                  <div className="sections-list">
                    {rec.sections.map((section, idx) => {
                      const isCompleted = idx < currentProgress.completedSections
                      return (
                        <div key={idx} className={`section-item ${isCompleted ? 'completed' : ''}`}>
                          <span className="section-icon">
                            {isCompleted ? '✓' : '○'}
                          </span>
                          <span className="section-name">{section}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <button 
                  className="continue-training-btn"
                  onClick={() => handleContinueTraining(rec)}
                >
                  {currentProgress.progress === 100 ? '✓ Completed' : `Continue Learning →`}
                </button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
