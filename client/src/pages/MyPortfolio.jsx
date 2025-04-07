import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyPortfolio() {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/portfolios/my', { withCredentials: true })
      .then(res => setPortfolio(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!portfolio) return <p className="text-center mt-10">No portfolio found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Portfolio</h1>
      <img src={portfolio.picture} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
      <h2 className="text-xl">{portfolio.name}</h2>
      <p className="italic">{portfolio.position}</p>
      <p className="mb-4">{portfolio.bio}</p>

      <div className="mb-4">
        <h3 className="font-semibold">Education:</h3>
        <ul className="list-disc list-inside">
          {portfolio.education.map((edu, idx) => (
            <li key={idx}>{edu.degree} at {edu.school} ({edu.year})</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Experience:</h3>
        <ul className="list-disc list-inside">
          {portfolio.experience.map((exp, idx) => (
            <li key={idx}>{exp.role} at {exp.company} ({exp.duration})</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold">Skills:</h3>
        <ul className="list-disc list-inside">
          {portfolio.skills.map((skill, idx) => (
            <li key={idx}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
