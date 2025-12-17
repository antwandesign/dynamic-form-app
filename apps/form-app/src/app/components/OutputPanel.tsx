import { FormValues } from '@zetta/types';

interface OutputPanelProps {
  submittedData: FormValues | null;
}

export function OutputPanel({ submittedData }: OutputPanelProps) {
  return (
    <section className="panel output-panel">
      <h2>Result</h2>
      <div className="output-container">
        {submittedData ? (
          <pre className="output-json">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        ) : (
          <p className="output-placeholder">
            Submit the form to see the JSON output here
          </p>
        )}
      </div>
    </section>
  );
}
