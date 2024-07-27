import React from "react";
import { Link,  useParams } from "react-router-dom";
import RadarChart from './RadarChart';
import axios from 'axios';
import { useState, useEffect } from "react";
import BarCharts from "./BarCharts";
import './CompareChart.css'


function CompareChart() {
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [radarChartData, setRadarChartData] = useState(null);
    const[profile, setProfile] = useState({})
    const {userID} = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3000/profile/${userID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                } );
                if (response.ok) {
                    const profiles = await response.json();
                    if (profiles.length > 0) {
                        setProfile(profiles[0]);
                    }
                } else {
                    throw new Error('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, [userID]);

    const bio = profile.bio

    useEffect(() => {
        const fetchStudents = async () => {
          try {
            const response = await axios.get('http://localhost:3000/compare/students/all');
            if (response.status === 200) {
              const fetchedStudentsData = response.data;
              const studentsData = fetchedStudentsData.filter(student => student.AdditionalInfo && student.AdditionalInfo.length > 0);
              setStudents(studentsData);
              generateRadarChartData(studentsData);
            } else {
              throw new Error('Failed to fetch students');
            }
          } catch (error) {
            console.error('Error fetching students:', error);
          }
        };
        fetchStudents();
    }, []);



    async function run(text) {
        try {
            const response = await axios.post(
                'https://api.sapling.ai/api/v1/statistics',
                {
                    "key":'OGJPDMELV46GMDLIZ10KT2QZ2Q8FVK5Y',
                    text,
                },
            );
            if (!response || !response.data || !response.data.readability_scores) {
                throw new Error('Invalid response structure');
            }
            let readabilityScore = response.data.readability_scores.flesch_kincaid_grade;
            if (readabilityScore < 1) {
                readabilityScore = 1;
              } else if (readabilityScore > 10) {
                readabilityScore = 10;
              }
            return readabilityScore;
        } catch (err) {
            const { msg } = err.response.data;
            return null;
        }
    }

    const calculateInterestsSimilarity= ( bio, interests ) => {
        try{
        let score = 0;

        const bioSimilarity = calculateStringSimilarity(bio, interests);
        score += bioSimilarity * 5;

        return score;
      }catch(error){
        return 0
    };}


  const calculateStringSimilarity = (str1, str2) => {
    if(str2===undefined || str1===undefined){
        return 0;
    }
    const maxLength = Math.max(str1.length, str2.length);
    const distance = levenshteinDistance(str1, str2);
    const similarity = 1 - distance / maxLength;
    return similarity;
  };

  const levenshteinDistance = (a, b) => {
    const matrix = Array.from(Array(a.length + 1), (_, i) => Array(b.length + 1).fill(i));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let i = 0; i <= b.length; i++) matrix[0][i] = i;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[a.length][b.length];
  };


  const generateRadarChartData = async () => {
    const selectedStudentsData = students.filter((student) => selectedStudents.includes(student.id));
    const radarData = await Promise.all(
      selectedStudentsData.map(async (student) => {
        let age = null;
        let gpa = null;
        let personalStatementScore = null;
        let interestsSimilarity = null;

        if (student.AdditionalInfo) {
          age = student.AdditionalInfo[0].age;
          gpa = student.AdditionalInfo[0].gpa;
          personalStatementScore = await run(student.AdditionalInfo[0].personal_statement);
          interestsSimilarity = calculateInterestsSimilarity(bio, student.AdditionalInfo[0].interests);
        }

        return {
          labels: ['Age', 'GPA', 'Personal Statement', 'Interests'],
          data: [age, gpa, personalStatementScore, interestsSimilarity],
          name: student.name
        };
      })
    );
    setRadarChartData(radarData);
  };


    const toggleSelectStudent = (studentId) => {
        if (selectedStudents.includes(studentId)) {
          setSelectedStudents(selectedStudents.filter(id => id !== studentId));
        } else {
          setSelectedStudents([...selectedStudents, studentId]);
        }
      };

    const compareStudents = () => {
        generateRadarChartData();
      };


    return (
        <>
        <h1>Compare Students</h1>
        <Link to={`/`}>
            <button  className="home-btn">Home</button>
        </Link>

        <div className="compare-container">
            <div className="students-list">
            {students.map((student) => (
                <div key={student.id} className={`student-card ${selectedStudents.includes(student.id) ? 'selected' : ''}`}>
                    <div className="student-header">
                        <h3>{student.name}</h3>
                        <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleSelectStudent(student.id)}
                        />
                    </div>
                </div>
            ))}
            </div>
            <button onClick={compareStudents}>Compare Selected Students</button>
            {radarChartData && (
            <div className="radar-charts">
                <RadarChart radarChartData={radarChartData} />
                <BarCharts radarChartData={radarChartData} />
            </div>
            ) }
      </div>
    </>
      )
}

export default CompareChart
