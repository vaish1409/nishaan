import { AlertTriangle } from "lucide-react";

export default function SafetyPanel() {
  return (
    <div className="safety-panel">
      <div className="safety-title">
        <AlertTriangle size={16} /> This sounds like it may need more than case notes
      </div>
      <p>If a child's safety is at risk right now, please reach out directly rather than waiting on an app:</p>
      <ul>
        <li><strong>CHILDLINE — 1098</strong> (24-hour, toll-free, all over India)</li>
        <li><strong>iCall — 9152987821</strong> (free psychosocial support helpline)</li>
      </ul>
      <p className="safety-note">
        This prototype doesn't screen or respond to situations like this — it only shows case notes for everyday
        behaviour questions.
      </p>
    </div>
  );
}
