import { AlertTriangle } from "lucide-react";

export default function SafetyPanel() {
  return (
    <div className="safety-panel">
      <div className="safety-title">
        <AlertTriangle size={16} /> This sounds like it may need more than case notes
      </div>
      <p>If a child's safety is at risk right now, please reach out directly rather than waiting on an app:</p>
      <ul>
        <li><strong>Emergency — 112</strong> (police, ambulance and fire, all over India)</li>
        <li><strong>CHILDLINE — 1098</strong> (24-hour, toll-free, all over India)</li>
        <li><strong>iCall — 9152987821</strong> (free psychosocial support helpline)</li>
      </ul>
      <p className="safety-note">
        Nishaan does not respond to situations like this. It only shows case notes for everyday behaviour
        questions. Helpline numbers can change, so please confirm them before relying on them.
      </p>
    </div>
  );
}
