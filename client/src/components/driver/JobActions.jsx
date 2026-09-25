import Button from '../common/Button';
export default function JobActions({ onAccept, onDecline }) { return <div className="flex gap-2"><Button onClick={onAccept}>Accept</Button><Button variant="secondary" onClick={onDecline}>Can’t take</Button></div>; }
