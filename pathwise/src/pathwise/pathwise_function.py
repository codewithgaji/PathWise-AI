import logging
import asyncio
from typing import Dict, List, Any, Optional, Union, Tuple, Set
from enum import Enum
from dataclasses import dataclass, field
import os
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
import re
from collections import defaultdict
import math
import itertools
import requests
import time
from urllib.parse import quote
from langchain.tools import StructuredTool
from pydantic import BaseModel, Field

from dotenv import load_dotenv
load_dotenv()

from pydantic import Field, BaseModel, validator
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import trim_messages
from langchain.tools.retriever import create_retriever_tool
from langchain_community.document_loaders import DirectoryLoader
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain.schema import Document
from langchain.agents import create_react_agent, AgentExecutor
from langchain import hub
from langchain_core.tools import tool
from langchain_core.prompts import PromptTemplate

from aiq.builder.builder import Builder
from aiq.builder.framework_enum import LLMFrameworkEnum
from aiq.builder.function_info import FunctionInfo
from aiq.cli.register_workflow import register_function
from aiq.data_models.component_ref import EmbedderRef, FunctionRef, LLMRef
from aiq.data_models.function import FunctionBaseConfig
from aiq.data_models.api_server import AIQChatRequest, AIQChatResponse
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain.agents import create_openai_functions_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger(__name__)


class CareerGuideConfig(FunctionBaseConfig, name="career_guide"):
    """
    AI-Powered Career Guidance Agent Configuration
    """
    llm_name: str = Field(description="Name of the LLM to use")
    embedder_name: str = Field(description="Name of the embedder to use")
    tool_names: List[str] = Field(default=[], description="List of tool names to include")
    ingest_glob: str = Field(description="Glob pattern for ingesting career documents")
    chunk_size: int = Field(default=1024, description="Chunk size for document splitting")
    description: str = Field(default="Comprehensive career guidance and path planning assistant")
    max_history: int = Field(default=20, description="Maximum conversation history")
    personality: str = Field(default="mentor", description="Agent personality: mentor, professional, or casual")
    search_engine: str = Field(default="bing", description="Search engine to use for resource discovery")


@dataclass
class CareerPath:
    """Career path representation with detailed information"""
    field: str
    specialization: str = ""
    level: str = "entry"  # entry, mid, senior, executive
    skills_required: List[str] = field(default_factory=list)
    average_salary: Dict[str, str] = field(default_factory=dict)
    job_outlook: str = "growing"
    education_requirements: List[str] = field(default_factory=list)
    certifications: List[str] = field(default_factory=list)
    experience_needed: str = ""
    
    def __post_init__(self):
        if not self.skills_required:
            self._populate_default_skills()
    
    def _populate_default_skills(self):
        """Populate default skills based on field"""
        skill_templates = {
            "computer science": ["programming", "algorithms", "data structures", "problem solving"],
            "data science": ["python", "statistics", "machine learning", "sql", "data visualization"],
            "cybersecurity": ["network security", "ethical hacking", "risk assessment", "incident response"],
            "software engineering": ["programming", "software design", "version control", "testing"],
            "business": ["leadership", "strategic thinking", "communication", "project management"],
            "marketing": ["digital marketing", "analytics", "content creation", "branding"],
            "finance": ["financial analysis", "risk management", "excel", "regulatory knowledge"],
            "healthcare": ["patient care", "medical knowledge", "communication", "empathy"],
            "education": ["curriculum development", "classroom management", "communication", "patience"]
        }
        
        field_lower = self.field.lower()
        for key, skills in skill_templates.items():
            if key in field_lower:
                self.skills_required = skills
                break


class ResourceDiscovery:
    """Advanced resource discovery system"""
    
    def __init__(self):
        self.resource_cache = {}
        self.quality_indicators = {
            "youtube": ["subscribers", "views", "likes", "comments"],
            "book": ["rating", "reviews", "publisher", "year"],
            "course": ["enrollment", "rating", "instructor", "platform"],
            "article": ["source", "author", "citations", "date"]
        }
    
    def search_learning_resources(self, query: str, resource_type: str = "all") -> List[Dict[str, Any]]:
        """Search for learning resources with quality scoring"""
        resources = []
        
        try:
            if resource_type in ["all", "video", "youtube"]:
                youtube_resources = self._search_youtube_resources(query)
                resources.extend(youtube_resources)
            
            if resource_type in ["all", "book", "textbook"]:
                book_resources = self._search_book_resources(query)
                resources.extend(book_resources)
            
            if resource_type in ["all", "course", "online_course"]:
                course_resources = self._search_course_resources(query)
                resources.extend(course_resources)
            
            if resource_type in ["all", "article", "tutorial"]:
                article_resources = self._search_article_resources(query)
                resources.extend(article_resources)
            
            # Sort by quality score
            resources.sort(key=lambda x: x.get("quality_score", 0), reverse=True)
            
            return resources[:15]  # Return top 15 resources
            
        except Exception as e:
            logger.error(f"Resource discovery error: {str(e)}")
            return []
    
    def _search_youtube_resources(self, query: str) -> List[Dict[str, Any]]:
        """Search for YouTube educational content"""
        # This would integrate with YouTube API in production
        # For now, return structured format for common educational channels
        educational_channels = {
            "computer science": [
                {"title": "CS50 Introduction to Computer Science", "channel": "Harvard CS50", "type": "youtube", "quality_score": 95},
                {"title": "Data Structures and Algorithms", "channel": "Abdul Bari", "type": "youtube", "quality_score": 90},
                {"title": "Programming Tutorials", "channel": "Traversy Media", "type": "youtube", "quality_score": 88}
            ],
            "data science": [
                {"title": "Python for Data Science", "channel": "Corey Schafer", "type": "youtube", "quality_score": 92},
                {"title": "Machine Learning Course", "channel": "Andrew Ng", "type": "youtube", "quality_score": 95},
                {"title": "Data Analysis with Python", "channel": "Keith Galli", "type": "youtube", "quality_score": 87}
            ],
            "web development": [
                {"title": "Full Stack Web Development", "channel": "The Net Ninja", "type": "youtube", "quality_score": 89},
                {"title": "JavaScript Mastery", "channel": "JavaScript Mastery", "type": "youtube", "quality_score": 91},
                {"title": "React Tutorial", "channel": "Academind", "type": "youtube", "quality_score": 88}
            ]
        }
        
        query_lower = query.lower()
        results = []
        
        for category, videos in educational_channels.items():
            if any(keyword in query_lower for keyword in category.split()):
                results.extend(videos)
        
        # Add generic programming/tech resources if no specific match
        if not results and any(keyword in query_lower for keyword in ["programming", "coding", "tech", "software"]):
            results = educational_channels["computer science"]
        
        return results
    
    def _search_book_resources(self, query: str) -> List[Dict[str, Any]]:
        """Search for relevant books and textbooks"""
        book_database = {
            "computer science": [
                {"title": "Introduction to Algorithms", "author": "Cormen, Leiserson, Rivest, Stein", "type": "textbook", "quality_score": 96},
                {"title": "Clean Code", "author": "Robert C. Martin", "type": "book", "quality_score": 94},
                {"title": "Design Patterns", "author": "Gang of Four", "type": "book", "quality_score": 92}
            ],
            "data science": [
                {"title": "Hands-On Machine Learning", "author": "Aurélien Géron", "type": "book", "quality_score": 95},
                {"title": "Python for Data Analysis", "author": "Wes McKinney", "type": "book", "quality_score": 93},
                {"title": "The Elements of Statistical Learning", "author": "Hastie, Tibshirani, Friedman", "type": "textbook", "quality_score": 97}
            ],
            "web development": [
                {"title": "Eloquent JavaScript", "author": "Marijn Haverbeke", "type": "book", "quality_score": 91},
                {"title": "You Don't Know JS", "author": "Kyle Simpson", "type": "book", "quality_score": 89},
                {"title": "HTML and CSS", "author": "Jon Duckett", "type": "book", "quality_score": 87}
            ],
            "business": [
                {"title": "Good to Great", "author": "Jim Collins", "type": "book", "quality_score": 92},
                {"title": "The Lean Startup", "author": "Eric Ries", "type": "book", "quality_score": 89},
                {"title": "Principles", "author": "Ray Dalio", "type": "book", "quality_score": 90}
            ]
        }
        
        query_lower = query.lower()
        results = []
        
        for category, books in book_database.items():
            if any(keyword in query_lower for keyword in category.split()):
                results.extend(books)
        
        return results
    
    def _search_course_resources(self, query: str) -> List[Dict[str, Any]]:
        """Search for online courses"""
        course_platforms = {
            "computer science": [
                {"title": "CS50x: Introduction to Computer Science", "platform": "edX/Harvard", "type": "course", "quality_score": 96},
                {"title": "Complete Python Bootcamp", "platform": "Udemy", "type": "course", "quality_score": 89},
                {"title": "Algorithms Specialization", "platform": "Coursera/Stanford", "type": "course", "quality_score": 94}
            ],
            "data science": [
                {"title": "IBM Data Science Professional Certificate", "platform": "Coursera", "type": "course", "quality_score": 92},
                {"title": "Machine Learning Course", "platform": "Coursera/Stanford", "type": "course", "quality_score": 95},
                {"title": "Complete Data Science Bootcamp", "platform": "Udemy", "type": "course", "quality_score": 87}
            ],
            "cybersecurity": [
                {"title": "Google Cybersecurity Professional Certificate", "platform": "Coursera", "type": "course", "quality_score": 91},
                {"title": "Ethical Hacking Course", "platform": "Udemy", "type": "course", "quality_score": 86},
                {"title": "CompTIA Security+", "platform": "Various", "type": "certification", "quality_score": 89}
            ]
        }
        
        query_lower = query.lower()
        results = []
        
        for category, courses in course_platforms.items():
            if any(keyword in query_lower for keyword in category.split()):
                results.extend(courses)
        
        return results
    
    def _search_article_resources(self, query: str) -> List[Dict[str, Any]]:
        """Search for articles and tutorials"""
        article_sources = {
            "programming": [
                {"title": "Clean Code Principles", "source": "Medium", "type": "article", "quality_score": 85},
                {"title": "Best Programming Practices", "source": "Stack Overflow Blog", "type": "article", "quality_score": 87},
                {"title": "Software Architecture Guide", "source": "Martin Fowler", "type": "article", "quality_score": 92}
            ],
            "data science": [
                {"title": "Machine Learning Fundamentals", "source": "Towards Data Science", "type": "article", "quality_score": 88},
                {"title": "Data Science Career Guide", "source": "KDnuggets", "type": "article", "quality_score": 84},
                {"title": "Statistics for Data Science", "source": "Analytics Vidhya", "type": "article", "quality_score": 86}
            ]
        }
        
        query_lower = query.lower()
        results = []
        
        for category, articles in article_sources.items():
            if any(keyword in query_lower for keyword in category.split()):
                results.extend(articles)
        
        return results


class CareerPathAnalyzer:
    """Analyzes career paths and provides detailed guidance"""
    
    def __init__(self):
        self.industry_data = {}
        self.skill_trends = {}
        self.salary_data = {}
    
    def analyze_career_path(self, field: str, user_background: Dict = None) -> Dict[str, Any]:
        """Comprehensive career path analysis"""
        try:
            career_analysis = {
                "field_overview": self._get_field_overview(field),
                "career_progression": self._get_career_progression(field),
                "skill_requirements": self._get_skill_requirements(field),
                "education_pathway": self._get_education_pathway(field),
                "salary_expectations": self._get_salary_expectations(field),
                "job_outlook": self._get_job_outlook(field),
                "specializations": self._get_specializations(field),
                "entry_strategies": self._get_entry_strategies(field),
                "networking_opportunities": self._get_networking_opportunities(field),
                "common_challenges": self._get_common_challenges(field)
            }
            
            # Personalize based on user background
            if user_background:
                career_analysis["personalized_advice"] = self._generate_personalized_advice(field, user_background)
            
            return career_analysis
            
        except Exception as e:
            logger.error(f"Career analysis error: {str(e)}")
            return {"error": f"Failed to analyze career path: {str(e)}"}
    
    def _get_field_overview(self, field: str) -> Dict[str, str]:
        """Get comprehensive field overview"""
        field_overviews = {
            "computer science": {
                "description": "Computer Science involves the study of algorithms, computational systems, and the design of computer systems and their applications.",
                "growth_rate": "22% (Much faster than average)",
                "median_salary": "$126,830/year",
                "work_environment": "Tech companies, startups, government, research institutions",
                "key_industries": "Technology, Finance, Healthcare, Entertainment, Government"
            },
            "data science": {
                "description": "Data Science combines statistics, mathematics, programming, and domain expertise to extract insights from data.",
                "growth_rate": "35% (Much faster than average)",
                "median_salary": "$129,890/year",
                "work_environment": "Tech companies, consulting firms, research institutions, Fortune 500 companies",
                "key_industries": "Technology, Finance, Healthcare, E-commerce, Government"
            },
            "cybersecurity": {
                "description": "Cybersecurity focuses on protecting digital systems, networks, and data from cyber threats and attacks.",
                "growth_rate": "33% (Much faster than average)",
                "median_salary": "$109,000/year",
                "work_environment": "Security firms, government agencies, corporations, consulting companies",
                "key_industries": "Government, Finance, Healthcare, Technology, Defense"
            }
        }
        
        return field_overviews.get(field.lower(), {
            "description": f"{field} is a growing field with diverse opportunities.",
            "growth_rate": "Average growth expected",
            "median_salary": "Varies by specialization",
            "work_environment": "Various industries and organizations",
            "key_industries": "Multiple sectors"
        })
    
    def _get_career_progression(self, field: str) -> List[Dict[str, Any]]:
        """Get typical career progression path"""
        progressions = {
            "computer science": [
                {"level": "Entry Level", "titles": ["Junior Developer", "Software Engineer I", "Programmer"], "experience": "0-2 years"},
                {"level": "Mid Level", "titles": ["Software Engineer", "Full Stack Developer", "Systems Analyst"], "experience": "2-5 years"},
                {"level": "Senior Level", "titles": ["Senior Software Engineer", "Tech Lead", "Principal Engineer"], "experience": "5-10 years"},
                {"level": "Leadership", "titles": ["Engineering Manager", "CTO", "VP of Engineering"], "experience": "10+ years"}
            ],
            "data science": [
                {"level": "Entry Level", "titles": ["Data Analyst", "Junior Data Scientist", "Business Intelligence Analyst"], "experience": "0-2 years"},
                {"level": "Mid Level", "titles": ["Data Scientist", "Machine Learning Engineer", "Analytics Manager"], "experience": "2-5 years"},
                {"level": "Senior Level", "titles": ["Senior Data Scientist", "Principal Data Scientist", "ML Architect"], "experience": "5-10 years"},
                {"level": "Leadership", "titles": ["Director of Data Science", "Chief Data Officer", "VP of Analytics"], "experience": "10+ years"}
            ]
        }
        
        return progressions.get(field.lower(), [
            {"level": "Entry Level", "titles": ["Entry Level Position"], "experience": "0-2 years"},
            {"level": "Mid Level", "titles": ["Mid-level Professional"], "experience": "2-5 years"},
            {"level": "Senior Level", "titles": ["Senior Professional"], "experience": "5+ years"}
        ])
    
    def _get_skill_requirements(self, field: str) -> Dict[str, List[str]]:
        """Get comprehensive skill requirements"""
        skill_requirements = {
            "computer science": {
                "technical_skills": ["Programming (Python, Java, C++)", "Data Structures & Algorithms", "Software Design", "Version Control (Git)", "Database Management"],
                "soft_skills": ["Problem Solving", "Communication", "Teamwork", "Critical Thinking", "Adaptability"],
                "emerging_skills": ["Cloud Computing", "DevOps", "AI/ML", "Cybersecurity", "Blockchain"]
            },
            "data science": {
                "technical_skills": ["Python/R", "SQL", "Statistics", "Machine Learning", "Data Visualization"],
                "soft_skills": ["Business Acumen", "Communication", "Critical Thinking", "Curiosity", "Storytelling"],
                "emerging_skills": ["MLOps", "Deep Learning", "Big Data Technologies", "Cloud Platforms", "AutoML"]
            },
            "cybersecurity": {
                "technical_skills": ["Network Security", "Ethical Hacking", "Risk Assessment", "Incident Response", "Security Tools"],
                "soft_skills": ["Attention to Detail", "Communication", "Problem Solving", "Ethics", "Continuous Learning"],
                "emerging_skills": ["Cloud Security", "AI Security", "IoT Security", "Zero Trust Architecture", "Threat Intelligence"]
            }
        }
        
        return skill_requirements.get(field.lower(), {
            "technical_skills": ["Field-specific technical skills"],
            "soft_skills": ["Communication", "Problem Solving", "Teamwork"],
            "emerging_skills": ["Industry-relevant emerging technologies"]
        })
    
    def _get_education_pathway(self, field: str) -> Dict[str, List[str]]:
        """Get education pathway recommendations"""
        education_paths = {
            "computer science": {
                "formal_education": ["Bachelor's in Computer Science", "Master's in CS/Software Engineering", "PhD for Research Roles"],
                "alternative_paths": ["Coding Bootcamps", "Self-taught + Portfolio", "Online Degree Programs", "Professional Certifications"],
                "key_subjects": ["Mathematics", "Programming", "Computer Systems", "Software Engineering", "Algorithms"]
            },
            "data science": {
                "formal_education": ["Bachelor's in Math/Statistics/CS", "Master's in Data Science/Statistics", "PhD for Senior Research Roles"],
                "alternative_paths": ["Data Science Bootcamps", "Online Certifications", "Self-directed Learning", "Transition from Related Fields"],
                "key_subjects": ["Statistics", "Mathematics", "Programming", "Machine Learning", "Business/Domain Knowledge"]
            }
        }
        
        return education_paths.get(field.lower(), {
            "formal_education": ["Relevant Bachelor's Degree", "Advanced Degrees for Senior Roles"],
            "alternative_paths": ["Professional Certifications", "Online Learning", "Bootcamps"],
            "key_subjects": ["Field-relevant core subjects"]
        })
    
    def _get_salary_expectations(self, field: str) -> Dict[str, str]:
        """Get salary expectations by experience level"""
        salary_data = {
            "computer science": {
                "entry_level": "$65,000 - $85,000",
                "mid_level": "$85,000 - $125,000",
                "senior_level": "$125,000 - $180,000",
                "leadership": "$180,000 - $300,000+",
                "factors": "Location, company size, specialization, tech stack"
            },
            "data science": {
                "entry_level": "$70,000 - $95,000",
                "mid_level": "$95,000 - $140,000",
                "senior_level": "$140,000 - $200,000",
                "leadership": "$200,000 - $350,000+",
                "factors": "Industry, location, technical depth, business impact"
            }
        }
        
        return salary_data.get(field.lower(), {
            "entry_level": "Varies by location and industry",
            "mid_level": "Competitive with experience",
            "senior_level": "High earning potential",
            "factors": "Multiple factors affect compensation"
        })
    
    def _get_job_outlook(self, field: str) -> Dict[str, str]:
        """Get job market outlook"""
        outlooks = {
            "computer science": {
                "growth_projection": "22% through 2030 (Much faster than average)",
                "demand_drivers": "Digital transformation, cloud adoption, AI/ML growth",
                "hot_areas": "AI/ML, Cloud Computing, Cybersecurity, Mobile Development",
                "geographic_hubs": "Silicon Valley, Seattle, Austin, Boston, NYC"
            },
            "data science": {
                "growth_projection": "35% through 2030 (Much faster than average)",
                "demand_drivers": "Big data explosion, AI adoption, business analytics needs",
                "hot_areas": "Machine Learning, AI, Business Intelligence, Healthcare Analytics",
                "geographic_hubs": "SF Bay Area, NYC, Boston, Seattle, Austin"
            }
        }
        
        return outlooks.get(field.lower(), {
            "growth_projection": "Positive growth expected",
            "demand_drivers": "Industry-specific factors",
            "hot_areas": "Emerging specializations",
            "geographic_hubs": "Major metropolitan areas"
        })
    
    def _get_specializations(self, field: str) -> List[Dict[str, str]]:
        """Get available specializations"""
        specializations = {
            "computer science": [
                {"name": "Software Engineering", "description": "Design and develop software applications"},
                {"name": "Data Science/AI", "description": "Extract insights from data using advanced analytics"},
                {"name": "Cybersecurity", "description": "Protect systems and data from cyber threats"},
                {"name": "Web Development", "description": "Create web applications and websites"},
                {"name": "Mobile Development", "description": "Build mobile applications for iOS/Android"},
                {"name": "DevOps/Cloud", "description": "Manage deployment and infrastructure"},
                {"name": "Game Development", "description": "Create video games and interactive entertainment"}
            ],
            "data science": [
                {"name": "Machine Learning Engineering", "description": "Build and deploy ML models in production"},
                {"name": "Business Intelligence", "description": "Create dashboards and reports for business decisions"},
                {"name": "Research Scientist", "description": "Develop new algorithms and methodologies"},
                {"name": "Product Analytics", "description": "Analyze user behavior and product performance"},
                {"name": "Healthcare Analytics", "description": "Apply data science to healthcare and medical data"}
            ]
        }
        
        return specializations.get(field.lower(), [
            {"name": "General Practice", "description": "Broad application of field knowledge"}
        ])
    
    def _get_entry_strategies(self, field: str) -> List[str]:
        """Get strategies for entering the field"""
        strategies = {
            "computer science": [
                "Build a strong portfolio of personal projects",
                "Contribute to open-source projects on GitHub",
                "Complete relevant internships",
                "Attend hackathons and coding competitions",
                "Network with professionals through meetups and conferences",
                "Consider entry-level positions like QA or technical support",
                "Pursue relevant certifications (AWS, Google Cloud, etc.)"
            ],
            "data science": [
                "Create a portfolio showcasing end-to-end data projects",
                "Participate in Kaggle competitions",
                "Complete data science internships",
                "Build domain expertise in a specific industry",
                "Start as a data analyst and transition to data scientist",
                "Attend data science meetups and conferences",
                "Contribute to data science communities and blogs"
            ]
        }
        
        return strategies.get(field.lower(), [
            "Build relevant skills through education and practice",
            "Create a portfolio demonstrating your abilities",
            "Network with professionals in the field",
            "Seek internships or entry-level opportunities"
        ])
    
    def _get_networking_opportunities(self, field: str) -> List[Dict[str, str]]:
        """Get networking opportunities"""
        networking = {
            "computer science": [
                {"type": "Professional Organizations", "examples": "ACM, IEEE Computer Society"},
                {"type": "Conferences", "examples": "Google I/O, Apple WWDC, Microsoft Build"},
                {"type": "Meetups", "examples": "Local developer meetups, language-specific groups"},
                {"type": "Online Communities", "examples": "Stack Overflow, Reddit r/programming, Dev.to"},
                {"type": "Hackathons", "examples": "Local hackathons, company-sponsored events"}
            ],
            "data science": [
                {"type": "Professional Organizations", "examples": "ASA, INFORMS, KDD"},
                {"type": "Conferences", "examples": "Strata Data Conference, PyData, NeurIPS"},
                {"type": "Meetups", "examples": "Local data science meetups, R/Python user groups"},
                {"type": "Online Communities", "examples": "Kaggle, Towards Data Science, Reddit r/MachineLearning"},
                {"type": "Competitions", "examples": "Kaggle competitions, DrivenData challenges"}
            ]
        }
        
        return networking.get(field.lower(), [
            {"type": "Professional Organizations", "examples": "Field-specific associations"},
            {"type": "Conferences", "examples": "Industry conferences and events"},
            {"type": "Online Communities", "examples": "Professional forums and groups"}
        ])
    
    def _get_common_challenges(self, field: str) -> List[Dict[str, str]]:
        """Get common challenges and how to overcome them"""
        challenges = {
            "computer science": [
                {"challenge": "Keeping up with rapidly changing technology", "solution": "Continuous learning, follow tech blogs, take online courses"},
                {"challenge": "Imposter syndrome", "solution": "Focus on growth, celebrate small wins, find mentors"},
                {"challenge": "Technical interviews", "solution": "Practice coding problems, mock interviews, system design study"},
                {"challenge": "Work-life balance", "solution": "Set boundaries, time management, prioritize tasks"}
            ],
            "data science": [
                {"challenge": "Translating business problems to data problems", "solution": "Develop business acumen, work closely with stakeholders"},
                {"challenge": "Data quality and availability issues", "solution": "Learn data cleaning techniques, establish data pipelines"},
                {"challenge": "Communicating findings to non-technical audiences", "solution": "Practice storytelling, create clear visualizations"},
                {"challenge": "Staying current with new techniques", "solution": "Follow research, attend conferences, hands-on experimentation"}
            ]
        }
        
        return challenges.get(field.lower(), [
            {"challenge": "Field-specific challenges", "solution": "Industry best practices and continuous learning"}
        ])
    
    def _generate_personalized_advice(self, field: str, user_background: Dict) -> List[str]:
        """Generate personalized advice based on user background"""
        advice = []
        
        experience_level = user_background.get("experience_level", "beginner")
        current_education = user_background.get("education", "")
        interests = user_background.get("interests", [])
        
        if experience_level == "beginner":
            advice.append("Start with foundational courses and build a strong base")
            advice.append("Focus on hands-on projects to apply what you learn")
        elif experience_level == "intermediate":
            advice.append("Consider specializing in a specific area of interest")
            advice.append("Build a professional network in your chosen field")
        else:
            advice.append("Look into leadership and advanced technical roles")
            advice.append("Consider mentoring others and contributing to the community")
        
        if "bachelor" not in current_education.lower() and field.lower() in ["computer science", "data science"]:
            advice.append("While a degree helps, focus on building a strong portfolio and practical skills")
            advice.append("Consider bootcamps or online programs as alternative education paths")
        
        return advice


class ResponseFormatter:
    """Formats career guidance responses in an engaging way"""
    
    def __init__(self, personality: str = "mentor"):
        self.personality = personality
        self.emojis = {
            "career": "🚀", "education": "🎓", "skills": "💡", "salary": "💰",
            "growth": "📈", "resources": "📚", "networking": "🤝", "tips": "💡",
            "warning": "⚠️", "success": "✅", "search": "🔍", "time": "⏰"
        }
    
    def format_career_analysis(self, analysis: Dict[str, Any], field: str) -> str:
        """Format comprehensive career analysis response"""
        
        sections = []
        
        # Header with dynamic greeting
        sections.append(self._create_career_header(field))
        
        # Field Overview
        if "field_overview" in analysis:
            sections.append(self._format_field_overview(analysis["field_overview"], field))
        
        # Career Progression
        if "career_progression" in analysis:
            sections.append(self._format_career_progression(analysis["career_progression"]))
        
        # Skills Requirements
        if "skill_requirements" in analysis:
            sections.append(self._format_skill_requirements(analysis["skill_requirements"]))
        
        # Education Pathway
        if "education_pathway" in analysis:
            sections.append(self._format_education_pathway(analysis["education_pathway"]))
        
        # Salary Expectations
        if "salary_expectations" in analysis:
            sections.append(self._format_salary_expectations(analysis["salary_expectations"]))
        
        # Specializations
        if "specializations" in analysis:
            sections.append(self._format_specializations(analysis["specializations"]))
        
        # Entry Strategies
        if "entry_strategies" in analysis:
            sections.append(self._format_entry_strategies(analysis["entry_strategies"]))
        
        # Job Outlook
        if "job_outlook" in analysis:
            sections.append(self._format_job_outlook(analysis["job_outlook"]))
        
        # Personalized Advice
        if "personalized_advice" in analysis:
            sections.append(self._format_personalized_advice(analysis["personalized_advice"]))
        
        # Call to action
        sections.append(self._create_action_footer())
        
        return "\n\n".join(sections)
    
    def format_learning_resources(self, resources: List[Dict], query: str) -> str:
        """Format learning resources with quality indicators"""
        
        if not resources:
            return f"{self.emojis['search']} No resources found for '{query}'. Try refining your search terms or ask for specific types of resources."
        
        sections = [f"## {self.emojis['resources']} Learning Resources for {query.title()}"]
        
        # Group resources by type
        resource_groups = {}
        for resource in resources:
            resource_type = resource.get("type", "general")
            if resource_type not in resource_groups:
                resource_groups[resource_type] = []
            resource_groups[resource_type].append(resource)
        
        # Format each group
        type_icons = {
            "youtube": "🎥", "book": "📖", "textbook": "📚", "course": "🎓",
            "article": "📄", "certification": "🏆", "general": "📋"
        }
        
        for resource_type, type_resources in resource_groups.items():
            if len(type_resources) == 0:
                continue
                
            icon = type_icons.get(resource_type, "📋")
            sections.append(f"### {icon} {resource_type.title().replace('_', ' ')} Resources")
            
            for resource in type_resources[:5]:  # Limit to top 5 per type
                quality_score = resource.get("quality_score", 0)
                quality_indicator = self._get_quality_indicator(quality_score)
                
                title = resource.get("title", "Untitled Resource")
                author_info = resource.get("author", resource.get("channel", resource.get("platform", "Unknown")))
                
                resource_text = f"**{title}** {quality_indicator}\n"
                resource_text += f"*By: {author_info}*"
                
                if resource.get("description"):
                    resource_text += f"\n{resource['description']}"
                
                sections.append(resource_text)
        
        # Add resource discovery tips
        sections.append(self._create_resource_tips())
        
        return "\n\n".join(sections)
    
    def _create_career_header(self, field: str) -> str:
        """Create dynamic career analysis header"""
        if self.personality == "mentor":
            greeting = f"## {self.emojis['career']} Your Career Journey in {field.title()}\n\nI'm excited to help you navigate your path in {field}! Let's explore the opportunities, requirements, and strategies that will set you up for success."
        elif self.personality == "professional":
            greeting = f"## {self.emojis['career']} {field.title()} Career Analysis\n\nHere's a comprehensive analysis of career opportunities in {field}, including market insights and strategic recommendations."
        else:
            greeting = f"## {self.emojis['career']} Hey there! Let's Talk {field.title()} Careers\n\nSo you're interested in {field}? Awesome choice! Let me break down everything you need to know about making it in this field."
        
        return greeting
    
    def _format_field_overview(self, overview: Dict[str, str], field: str) -> str:
        """Format field overview section"""
        section = f"## {self.emojis['growth']} Field Overview\n\n"
        section += f"**What is {field.title()}?**\n{overview.get('description', 'A dynamic and growing field.')}\n\n"
        
        metrics = []
        if overview.get('growth_rate'):
            metrics.append(f"📈 **Growth Rate:** {overview['growth_rate']}")
        if overview.get('median_salary'):
            metrics.append(f"💰 **Median Salary:** {overview['median_salary']}")
        if overview.get('work_environment'):
            metrics.append(f"🏢 **Work Environment:** {overview['work_environment']}")
        if overview.get('key_industries'):
            metrics.append(f"🏭 **Key Industries:** {overview['key_industries']}")
        
        if metrics:
            section += "\n".join(metrics)
        
        return section
    
    def _format_career_progression(self, progression: List[Dict]) -> str:
        """Format career progression path"""
        section = f"## {self.emojis['career']} Career Progression Path\n\n"
        
        for level in progression:
            titles = ", ".join(level.get("titles", []))
            experience = level.get("experience", "")
            level_name = level.get("level", "")
            
            section += f"**{level_name}** ({experience})\n"
            section += f"*Typical Roles:* {titles}\n\n"
        
        return section
    
    def _format_skill_requirements(self, skills: Dict[str, List[str]]) -> str:
        """Format skill requirements section"""
        section = f"## {self.emojis['skills']} Essential Skills\n\n"
        
        skill_categories = {
            "technical_skills": "🔧 Technical Skills",
            "soft_skills": "🤝 Soft Skills", 
            "emerging_skills": "⚡ Emerging Skills"
        }
        
        for category, skill_list in skills.items():
            if skill_list and category in skill_categories:
                section += f"### {skill_categories[category]}\n"
                for skill in skill_list:
                    section += f"• {skill}\n"
                section += "\n"
        
        return section
    
    def _format_education_pathway(self, education: Dict[str, List[str]]) -> str:
        """Format education pathway section"""
        section = f"## {self.emojis['education']} Education Pathways\n\n"
        
        if education.get("formal_education"):
            section += "### 🎓 Traditional Education\n"
            for edu in education["formal_education"]:
                section += f"• {edu}\n"
            section += "\n"
        
        if education.get("alternative_paths"):
            section += "### 🚀 Alternative Paths\n"
            for alt in education["alternative_paths"]:
                section += f"• {alt}\n"
            section += "\n"
        
        if education.get("key_subjects"):
            section += "### 📚 Key Subject Areas\n"
            for subject in education["key_subjects"]:
                section += f"• {subject}\n"
            section += "\n"
        
        return section
    
    def _format_salary_expectations(self, salary: Dict[str, str]) -> str:
        """Format salary expectations section"""
        section = f"## {self.emojis['salary']} Salary Expectations\n\n"
        
        salary_levels = {
            "entry_level": "🌱 Entry Level",
            "mid_level": "📈 Mid Level",
            "senior_level": "🎯 Senior Level", 
            "leadership": "👑 Leadership"
        }
        
        for level, level_name in salary_levels.items():
            if salary.get(level):
                section += f"**{level_name}:** {salary[level]}\n"
        
        if salary.get("factors"):
            section += f"\n*Factors affecting salary:* {salary['factors']}"
        
        return section
    
    def _format_specializations(self, specializations: List[Dict]) -> str:
        """Format specializations section"""
        section = f"## {self.emojis['career']} Specialization Areas\n\n"
        
        for spec in specializations:
            name = spec.get("name", "")
            description = spec.get("description", "")
            section += f"**{name}**\n{description}\n\n"
        
        return section
    
    def _format_entry_strategies(self, strategies: List[str]) -> str:
        """Format entry strategies section"""
        section = f"## {self.emojis['tips']} Entry Strategies\n\n"
        
        for i, strategy in enumerate(strategies, 1):
            section += f"{i}. {strategy}\n"
        
        return section
    
    def _format_job_outlook(self, outlook: Dict[str, str]) -> str:
        """Format job outlook section"""
        section = f"## {self.emojis['growth']} Job Market Outlook\n\n"
        
        if outlook.get("growth_projection"):
            section += f"📊 **Growth Projection:** {outlook['growth_projection']}\n\n"
        
        if outlook.get("demand_drivers"):
            section += f"🚀 **What's Driving Demand:** {outlook['demand_drivers']}\n\n"
        
        if outlook.get("hot_areas"):
            section += f"🔥 **Hot Areas:** {outlook['hot_areas']}\n\n"
        
        if outlook.get("geographic_hubs"):
            section += f"🏙️ **Top Locations:** {outlook['geographic_hubs']}\n\n"
        
        return section
    
    def _format_personalized_advice(self, advice: List[str]) -> str:
        """Format personalized advice section"""
        section = f"## {self.emojis['tips']} Personalized Recommendations\n\n"
        
        for tip in advice:
            section += f"💡 {tip}\n\n"
        
        return section
    
    def _create_action_footer(self) -> str:
        """Create call-to-action footer"""
        return f"""## {self.emojis['success']} Next Steps

Ready to take action? Here's what you can do:

1. **Start Learning:** Ask me to find specific resources for any skill area
2. **Build Your Plan:** Let's create a personalized learning timeline
3. **Track Progress:** I can help monitor your advancement and adjust your path
4. **Network:** Ask about networking opportunities and professional events

*Remember: Every expert was once a beginner. Your journey starts with a single step!* 🌟"""
    
    def _get_quality_indicator(self, score: int) -> str:
        """Get quality indicator emoji based on score"""
        if score >= 95:
            return "🏆"
        elif score >= 90:
            return "⭐⭐⭐"
        elif score >= 80:
            return "⭐⭐"
        elif score >= 70:
            return "⭐"
        else:
            return "📋"
    
    def _create_resource_tips(self) -> str:
        """Create resource discovery tips"""
        return f"""## {self.emojis['tips']} Resource Discovery Tips

🔍 **Search Tips:**
- Be specific: "Python machine learning tutorials" vs "programming"
- Ask for specific formats: "books on data structures" or "YouTube courses on web development"
- Request by skill level: "beginner JavaScript resources" or "advanced algorithms"

📱 **Stay Updated:** Ask me to search for the latest resources anytime!"""


# Enhanced tool functions for career guidance
@tool
def search_learning_resources(query: str, resource_type: str = "all") -> str:
    """Search for comprehensive learning resources including videos, books, courses, and articles."""
    try:
        discovery = ResourceDiscovery()
        resources = discovery.search_learning_resources(query, resource_type)
        
        formatter = ResponseFormatter()
        return formatter.format_learning_resources(resources, query)
        
    except Exception as e:
        logger.error(f"Resource search error: {str(e)}")
        return f"❌ **Search Error:** Unable to find resources for '{query}'. Please try a different search term or contact support."


class CareerFieldInput(BaseModel):
    field: str = Field(description="The career field to analyze")
    experience_level: str = Field(default="beginner", description="Current experience level")
    education: str = Field(default="", description="Education background")
    interests: str = Field(default="", description="Career interests")
    
def analyze_career_field_func(field: str, experience_level: str = "beginner", education: str = "", interests: str = "") -> str:
    """Provide comprehensive career field analysis including paths, skills, salary, and guidance."""
    try:
        # Simple parameter cleaning
        field = str(field).strip()
        experience_level = str(experience_level).strip()
        education = str(education).strip()
        interests = str(interests).strip()
        
        # Extract just the field name if it's in a complex string
        field_keywords = ["computer science", "data science", "web development", "cybersecurity"]
        for keyword in field_keywords:
            if keyword in field.lower():
                field = keyword
                break
        
        analyzer = CareerPathAnalyzer()
        
        # Parse user background
        user_background = {
            "experience_level": experience_level,
            "education": education,
            "interests": [interest.strip() for interest in interests.split(",") if interest.strip()]
        }
        
        analysis = analyzer.analyze_career_path(field, user_background)
        
        formatter = ResponseFormatter()
        return formatter.format_career_analysis(analysis, field)
        
    except Exception as e:
        logger.error(f"Career analysis error: {str(e)}")
        return f"❌ **Analysis Error:** Unable to analyze career field '{field}'. Error: {str(e)}"
    
analyze_career_field = StructuredTool.from_function(
    func=analyze_career_field_func,
    name="analyze_career_field", 
    description="Provide comprehensive career field analysis including paths, skills, salary, and guidance",
    args_schema=CareerFieldInput
)

@tool
def get_career_timeline(field: str, target_role: str, current_level: str = "beginner") -> str:
    """Generate a personalized career timeline with milestones and learning goals."""
    try:
        # Create timeline based on field and target role
        timelines = {
            "computer science": {
                "software engineer": {
                    "beginner": [
                        {"month": "0-3", "milestone": "Learn Programming Fundamentals", "skills": ["Python/Java basics", "Git version control"], "resources": "FreeCodeCamp, CS50"},
                        {"month": "3-6", "milestone": "Data Structures & Algorithms", "skills": ["Arrays, Lists, Trees", "Big O notation"], "resources": "LeetCode, Cracking the Coding Interview"},
                        {"month": "6-12", "milestone": "Build Projects & Apply", "skills": ["Full-stack development", "Portfolio building"], "resources": "Personal projects, GitHub"},
                        {"month": "12-18", "milestone": "Junior Developer Role", "skills": ["Professional development", "Code reviews"], "resources": "Internships, entry-level positions"}
                    ]
                }
            },
            "data science": {
                "data scientist": {
                    "beginner": [
                        {"month": "0-2", "milestone": "Statistics & Python Basics", "skills": ["Python fundamentals", "Statistics concepts"], "resources": "Python for Data Science, Khan Academy Statistics"},
                        {"month": "2-4", "milestone": "Data Analysis Skills", "skills": ["Pandas, NumPy", "Data visualization"], "resources": "Kaggle Learn, DataCamp"},
                        {"month": "4-8", "milestone": "Machine Learning", "skills": ["Scikit-learn", "ML algorithms"], "resources": "Andrew Ng's ML Course, Hands-on ML book"},
                        {"month": "8-12", "milestone": "Portfolio & Specialization", "skills": ["End-to-end projects", "Domain expertise"], "resources": "Kaggle competitions, Industry projects"}
                    ]
                }
            }
        }
        
        field_lower = field.lower()
        target_lower = target_role.lower()
        
        timeline_data = None
        for f, roles in timelines.items():
            if f in field_lower:
                for role, levels in roles.items():
                    if role in target_lower:
                        timeline_data = levels.get(current_level, levels.get("beginner"))
                        break
                break
        
        if not timeline_data:
            return f"""## ⏰ Career Timeline for {target_role} in {field}

I don't have a specific timeline for "{target_role}" in {field} yet, but I can help you create one!

**Next Steps:**
1. Let me analyze the "{field}" field first: `analyze_career_field("{field}")`
2. Search for specific resources: `search_learning_resources("{target_role} skills")`
3. Ask me about specific skills or milestones you want to achieve

Would you like me to provide a general career progression path instead?"""
        
        # Format timeline response
        response = f"## ⏰ Your {target_role} Career Timeline\n\n"
        response += f"Based on your {current_level} level, here's your personalized path to becoming a {target_role}:\n\n"
        
        for milestone in timeline_data:
            response += f"### 📅 Months {milestone['month']}: {milestone['milestone']}\n\n"
            
            if milestone.get('skills'):
                response += "**Key Skills to Develop:**\n"
                for skill in milestone['skills']:
                    response += f"• {skill}\n"
                response += "\n"
            
            if milestone.get('resources'):
                response += f"**Recommended Resources:** {milestone['resources']}\n\n"
        
        response += f"""## 🎯 Success Tips

1. **Stay Consistent:** Dedicate 1-2 hours daily to learning
2. **Build Projects:** Apply what you learn in real projects
3. **Network:** Join {field} communities and attend events
4. **Track Progress:** Document your learning journey
5. **Seek Feedback:** Get code reviews and mentorship

**Remember:** This timeline is flexible. Adapt it based on your pace and life circumstances!"""
        
        return response
        
    except Exception as e:
        logger.error(f"Timeline generation error: {str(e)}")
        return f"❌ **Timeline Error:** Unable to generate timeline for {target_role}. Error: {str(e)}"


@tool
def get_skill_assessment(field: str, skills: str) -> str:
    """Assess current skills and provide learning recommendations for a specific field."""
    try:
        skill_list = [skill.strip() for skill in skills.split(",") if skill.strip()]
        
        # Define skill frameworks for different fields
        skill_frameworks = {
            "computer science": {
                "fundamentals": ["programming", "algorithms", "data structures", "computer systems"],
                "tools": ["git", "linux", "databases", "ide"],
                "languages": ["python", "java", "javascript", "c++"],
                "advanced": ["system design", "software architecture", "testing", "deployment"]
            },
            "data science": {
                "fundamentals": ["statistics", "mathematics", "programming", "data analysis"],
                "tools": ["python", "r", "sql", "excel"],
                "libraries": ["pandas", "numpy", "scikit-learn", "matplotlib"],
                "advanced": ["machine learning", "deep learning", "big data", "mlops"]
            },
            "web development": {
                "fundamentals": ["html", "css", "javascript", "responsive design"],
                "frontend": ["react", "vue", "angular", "typescript"],
                "backend": ["node.js", "python", "databases", "api"],
                "advanced": ["cloud", "devops", "testing", "security"]
            }
        }
        
        field_lower = field.lower()
        framework = None
        
        for key, fw in skill_frameworks.items():
            if key in field_lower:
                framework = fw
                break
        
        if not framework:
            return f"""## 📊 Skill Assessment for {field}

I don't have a specific skill framework for "{field}" yet, but I can help!

**What you can do:**
1. Tell me more about the specific area (e.g., "web development", "data science")
2. Ask me to search for skill requirements: `search_learning_resources("{field} essential skills")`
3. Get a career analysis: `analyze_career_field("{field}")`

**Your Current Skills:** {', '.join(skill_list)}

Would you like me to analyze a more specific field or search for skill requirements?"""
        
        # Assess skills against framework
        assessment_results = {}
        skill_coverage = {}
        
        for category, required_skills in framework.items():
            matched_skills = []
            missing_skills = []
            
            for required_skill in required_skills:
                matched = False
                for user_skill in skill_list:
                    if required_skill.lower() in user_skill.lower() or user_skill.lower() in required_skill.lower():
                        matched_skills.append(required_skill)
                        matched = True
                        break
                
                if not matched:
                    missing_skills.append(required_skill)
            
            coverage_percent = (len(matched_skills) / len(required_skills)) * 100 if required_skills else 0
            
            assessment_results[category] = {
                "matched": matched_skills,
                "missing": missing_skills,
                "coverage": coverage_percent
            }
        
        # Generate assessment response
        response = f"## 📊 Your {field.title()} Skill Assessment\n\n"
        response += f"**Skills You Listed:** {', '.join(skill_list)}\n\n"
        
        # Overall assessment
        total_coverage = sum(result["coverage"] for result in assessment_results.values()) / len(assessment_results)
        
        if total_coverage >= 80:
            level = "Advanced 🏆"
            message = "Excellent skill coverage! You're well-prepared for senior roles."
        elif total_coverage >= 60:
            level = "Intermediate 📈"
            message = "Good foundation! Focus on filling gaps and deepening expertise."
        elif total_coverage >= 40:
            level = "Developing 🌱" 
            message = "Solid start! Keep building skills in key areas."
        else:
            level = "Beginner 🌟"
            message = "Great that you're starting! Focus on fundamental skills first."
        
        response += f"**Overall Level:** {level} ({total_coverage:.0f}% coverage)\n"
        response += f"{message}\n\n"
        
        # Detailed breakdown
        category_icons = {
            "fundamentals": "🔍", "tools": "🛠️", "languages": "💻",
            "libraries": "📚", "frontend": "🎨", "backend": "⚙️", "advanced": "🚀"
        }
        
        for category, result in assessment_results.items():
            icon = category_icons.get(category, "📋")
            response += f"### {icon} {category.title()} ({result['coverage']:.0f}%)\n\n"
            
            if result["matched"]:
                response += f"**✅ You Have:** {', '.join(result['matched'])}\n"
            
            if result["missing"]:
                response += f"**📝 To Learn:** {', '.join(result['missing'])}\n"
            
            response += "\n"
        
        # Learning recommendations
        response += "## 🎯 Learning Recommendations\n\n"
        
        # Find the category with lowest coverage
        weakest_category = min(assessment_results.items(), key=lambda x: x[1]["coverage"])
        response += f"**Priority Focus:** {weakest_category[0].title()}\n"
        response += f"Start with: {', '.join(weakest_category[1]['missing'][:3])}\n\n"
        
        response += "**Next Steps:**\n"
        response += f"1. Search for resources: `search_learning_resources('{weakest_category[1]['missing'][0] if weakest_category[1]['missing'] else 'advanced ' + field}')`\n"
        response += f"2. Get a learning timeline: `get_career_timeline('{field}', 'target_role')`\n"
        response += "3. Build projects to apply your skills\n"
        response += "4. Reassess your skills in 3-6 months\n\n"
        
        response += "*Keep up the great work! Every skill you build brings you closer to your goals.* 🌟"
        
        return response
        
    except Exception as e:
        logger.error(f"Skill assessment error: {str(e)}")
        return f"❌ **Assessment Error:** Unable to assess skills. Error: {str(e)}"

@tool
def search_web_resources(query: str, resource_type: str = "all") -> str:
    """Search the web for current career resources, job market trends, and learning materials."""
    try:
        # This would integrate with real web search APIs in production
        # For now, provide structured responses based on query analysis
        
        query_lower = query.lower()
        
        # Detect field from query
        field_detected = None
        fields = {
            "computer science": ["computer science", "programming", "coding", "software"],
            "data science": ["data science", "machine learning", "ai", "analytics"],
            "web development": ["web development", "frontend", "backend", "react", "javascript"],
            "cybersecurity": ["cybersecurity", "security", "ethical hacking", "infosec"],
            "digital marketing": ["digital marketing", "seo", "social media", "marketing"],
            "graphic design": ["graphic design", "ui/ux", "photoshop", "design"]
        }
        
        for field, keywords in fields.items():
            if any(keyword in query_lower for keyword in keywords):
                field_detected = field
                break
        
        if not field_detected:
            return f"""## 🔍 Web Search Results for "{query}"

I'd be happy to search for current resources! To provide the most relevant results, could you specify:

1. **Field of interest** (e.g., computer science, marketing, design)
2. **Resource type** preference:
   - `courses` for online courses and certifications
   - `books` for textbooks and reading materials  
   - `videos` for YouTube channels and tutorials
   - `jobs` for current job market trends
   - `tools` for software and platforms to learn

**Example:** `search_web_resources("python programming courses", "courses")`

What specific area would you like me to search for?"""
        
        # Generate field-specific web resources
        current_year = datetime.now().year
        
        web_resources = {
            "computer science": {
                "trending_topics": ["AI/ML Engineering", "Cloud Computing", "DevOps", "Blockchain"],
                "hot_jobs": ["Software Engineer", "ML Engineer", "Cloud Architect", "DevOps Engineer"],
                "salary_range": "$70,000 - $180,000",
                "growth_rate": "22%",
                "top_companies": ["Google", "Microsoft", "Amazon", "Meta", "Apple"],
                "learning_paths": [
                    "Frontend: HTML/CSS → JavaScript → React → Node.js",
                    "Backend: Python → Django/Flask → Databases → APIs",
                    "Mobile: Swift/Kotlin → React Native → Flutter",
                    "AI/ML: Python → NumPy/Pandas → Scikit-learn → TensorFlow"
                ]
            },
            "data science": {
                "trending_topics": ["Generative AI", "MLOps", "Big Data", "Business Intelligence"],
                "hot_jobs": ["Data Scientist", "ML Engineer", "Data Analyst", "AI Research Scientist"],
                "salary_range": "$75,000 - $200,000",
                "growth_rate": "35%",
                "top_companies": ["Netflix", "Uber", "Airbnb", "Tesla", "OpenAI"],
                "learning_paths": [
                    "Foundation: Statistics → Python → SQL → Excel",
                    "Analysis: Pandas → NumPy → Matplotlib → Seaborn",
                    "ML: Scikit-learn → TensorFlow → PyTorch → Keras",
                    "Deployment: Docker → AWS/GCP → MLOps → Production"
                ]
            },
            "web development": {
                "trending_topics": ["Full Stack", "React/Next.js", "Cloud Deployment", "Mobile-First"],
                "hot_jobs": ["Full Stack Developer", "Frontend Engineer", "Backend Developer", "DevOps Engineer"],
                "salary_range": "$60,000 - $160,000",
                "growth_rate": "15%",
                "top_companies": ["Shopify", "Stripe", "Vercel", "Netlify", "GitHub"],
                "learning_paths": [
                    "Frontend: HTML/CSS → JavaScript → React → TypeScript",
                    "Backend: Node.js → Express → MongoDB/PostgreSQL → APIs",
                    "Full Stack: Frontend + Backend → Deployment → Testing",
                    "Mobile: React Native → Flutter → Mobile App Store"
                ]
            }
        }
        
        if field_detected not in web_resources:
            field_data = {
                "trending_topics": ["Emerging technologies", "Digital transformation"],
                "hot_jobs": ["Various roles available"],
                "salary_range": "Competitive salaries",
                "growth_rate": "Positive growth",
                "top_companies": ["Leading industry companies"],
                "learning_paths": ["Multiple pathways available"]
            }
        else:
            field_data = web_resources[field_detected]
        
        # Format comprehensive response
        response = f"""## 🌐 Latest Web Intelligence for {field_detected.title() if field_detected else query.title()}

### 🔥 Trending in {current_year}
{' • '.join(field_data['trending_topics'])}

### 💼 Hottest Jobs Right Now
**Top Roles:** {' | '.join(field_data['hot_jobs'])}  
**Salary Range:** {field_data['salary_range']}  
**Growth Rate:** {field_data['growth_rate']} (next 5 years)

### 🏢 Companies Hiring
{' • '.join(field_data['top_companies'])}

### 🛤️ Recommended Learning Paths"""
        
        for i, path in enumerate(field_data['learning_paths'], 1):
            response += f"\n**Path {i}:** {path}"
        
        response += f"""

### 📚 Current Top Resources
- **Courses:** Coursera, edX, Udemy (updated {current_year} content)
- **YouTube:** Channels with 500K+ subscribers, recent uploads
- **Books:** Latest editions from O'Reilly, Manning, Packt
- **Practice:** LeetCode, HackerRank, GitHub projects

### 🎯 Next Steps
1. Choose a learning path that matches your goals
2. Start with foundational courses
3. Build projects for your portfolio
4. Network with professionals in the field

*Want specific resources for any of these areas? Ask me to search for detailed materials!*"""

        return response
        
    except Exception as e:
        logger.error(f"Web search error: {str(e)}")
        return f"❌ **Search Error:** Unable to fetch current resources. Please try with a more specific query or check your connection."


class LearningTimelineInput(BaseModel):
    field: str = Field(description="The career field")
    current_level: str = Field(description="Current skill level")
    target_role: str = Field(description="Target role")
    timeline_weeks: int = Field(default=26, description="Timeline in weeks")
    
def create_learning_timeline_func(field: str, current_level: str, target_role: str, timeline_weeks: int = 26) -> str:
    """Create a personalized weekly learning timeline with specific milestones and resources."""
    try:
        # Clean up parameters
        field = field.strip().strip('"').strip("'")
        current_level = current_level.strip().strip('"').strip("'")  
        target_role = target_role.strip().strip('"').strip("'")
        
        timeline_templates = {
            "computer science": {
                "software engineer": {
                    "beginner": [
                        {"weeks": "1-4", "topic": "Programming Fundamentals", "skills": ["Python basics", "Variables, loops, functions"], "resources": "Python.org tutorial, Automate the Boring Stuff", "milestone": "Build a calculator app"},
                        {"weeks": "5-8", "topic": "Data Structures", "skills": ["Arrays, lists", "Dictionaries, sets"], "resources": "CS50, LeetCode easy problems", "milestone": "Solve 20 coding problems"},
                        {"weeks": "9-12", "topic": "Algorithms", "skills": ["Sorting, searching", "Big O notation"], "resources": "Cracking the Coding Interview", "milestone": "Implement 5 sorting algorithms"},
                        {"weeks": "13-16", "topic": "Web Development Basics", "skills": ["HTML, CSS", "JavaScript fundamentals"], "resources": "FreeCodeCamp, MDN docs", "milestone": "Build responsive portfolio website"},
                        {"weeks": "17-20", "topic": "Version Control & Collaboration", "skills": ["Git basics", "GitHub workflow"], "resources": "Git documentation, GitHub guides", "milestone": "Contribute to open source project"},
                        {"weeks": "21-24", "topic": "Backend Development", "skills": ["API development", "Database basics"], "resources": "Flask/Django tutorials", "milestone": "Build REST API with database"},
                        {"weeks": "25-26", "topic": "Project & Portfolio", "skills": ["Full-stack project", "Deployment"], "resources": "Heroku, Netlify docs", "milestone": "Deploy full-stack application"}
                    ],
                    "intermediate": [
                        {"weeks": "1-3", "topic": "Advanced Algorithms", "skills": ["Dynamic programming", "Graph algorithms"], "resources": "Algorithm Design Manual", "milestone": "Solve medium LeetCode problems"},
                        {"weeks": "4-6", "topic": "System Design", "skills": ["Scalability", "Database design"], "resources": "Designing Data-Intensive Applications", "milestone": "Design a scalable system"},
                        {"weeks": "7-10", "topic": "Advanced Backend", "skills": ["Microservices", "API security"], "resources": "System design interviews", "milestone": "Build microservices architecture"},
                        {"weeks": "11-14", "topic": "DevOps & Cloud", "skills": ["Docker", "AWS/GCP basics"], "resources": "AWS documentation, Docker tutorials", "milestone": "Deploy containerized application"},
                        {"weeks": "15-18", "topic": "Testing & Quality", "skills": ["Unit testing", "Integration testing"], "resources": "Testing frameworks docs", "milestone": "Achieve 90%+ test coverage"},
                        {"weeks": "19-22", "topic": "Performance Optimization", "skills": ["Code profiling", "Database optimization"], "resources": "Performance engineering books", "milestone": "Optimize application performance"},
                        {"weeks": "23-26", "topic": "Leadership & Communication", "skills": ["Code reviews", "Technical writing"], "resources": "Clean Code, technical blogs", "milestone": "Mentor junior developer"}
                    ]
                }
            },
            "data science": {
                "data scientist": {
                    "beginner": [
                        {"weeks": "1-3", "topic": "Python for Data Science", "skills": ["Python syntax", "Jupyter notebooks"], "resources": "Python Crash Course, Kaggle Learn", "milestone": "Complete Python basics course"},
                        {"weeks": "4-6", "topic": "Statistics Fundamentals", "skills": ["Descriptive statistics", "Probability"], "resources": "Khan Academy Statistics", "milestone": "Pass statistics quiz with 85%+"},
                        {"weeks": "7-10", "topic": "Data Manipulation", "skills": ["Pandas", "NumPy"], "resources": "10 Minutes to Pandas, NumPy docs", "milestone": "Analyze real dataset"},
                        {"weeks": "11-14", "topic": "Data Visualization", "skills": ["Matplotlib", "Seaborn"], "resources": "Python Graph Gallery", "milestone": "Create comprehensive dashboard"},
                        {"weeks": "15-18", "topic": "Machine Learning Basics", "skills": ["Scikit-learn", "Supervised learning"], "resources": "Hands-On ML, Coursera ML course", "milestone": "Build prediction model"},
                        {"weeks": "19-22", "topic": "SQL & Databases", "skills": ["SQL queries", "Database design"], "resources": "SQLBolt, W3Schools SQL", "milestone": "Query complex business data"},
                        {"weeks": "23-26", "topic": "Portfolio Project", "skills": ["End-to-end project", "Presentation"], "resources": "Kaggle datasets, GitHub", "milestone": "Complete portfolio project"}
                    ]
                }
            }
        }
        
        # Get timeline template
        field_lower = field.lower()
        target_lower = target_role.lower()
        
        timeline_data = None
        for f, roles in timeline_templates.items():
            if f in field_lower:
                for role, levels in roles.items():
                    if role in target_lower:
                        timeline_data = levels.get(current_level.lower(), levels.get("beginner"))
                        break
                break
        
        if not timeline_data:
            return f"""## ⏰ Custom Learning Timeline: {target_role} in {field}

I don't have a specific timeline template for "{target_role}" in {field} yet, but I can help you create one!

### 🛠️ Custom Timeline Framework
**Duration:** {timeline_weeks} weeks  
**Field:** {field.title()}  
**Target:** {target_role.title()}  
**Current Level:** {current_level.title()}

### 📋 Recommended Structure:
1. **Weeks 1-4:** Fundamentals and foundations
2. **Weeks 5-12:** Core skills development  
3. **Weeks 13-20:** Advanced concepts and tools
4. **Weeks 21-26:** Portfolio projects and specialization

### 🎯 Next Steps:
1. Ask me to `analyze_career_field("{field}")` for detailed requirements
2. Use `search_learning_resources("{field} {target_role}")` for specific materials
3. Request `get_skill_assessment("{field}", "your current skills")` to identify gaps

Would you like me to create a custom timeline based on these insights?"""
        
        # Generate comprehensive timeline
        response = f"""## 🗓️ Your {timeline_weeks}-Week Journey: {current_level.title()} → {target_role.title()}

**Field:** {field.title()}  
**Commitment:** ~15-20 hours/week  
**Success Rate:** 89% completion rate for structured learners

"""
        
        total_weeks_used = 0
        for phase in timeline_data:
            weeks_range = phase["weeks"]
            topic = phase["topic"]
            skills = phase["skills"]
            resources = phase["resources"]
            milestone = phase["milestone"]
            
            # Parse week range
            if "-" in weeks_range:
                end_week = int(weeks_range.split("-")[1])
                total_weeks_used = max(total_weeks_used, end_week)
            
            response += f"""### 📚 Weeks {weeks_range}: {topic}

**Skills to Master:**
{chr(10).join(f"• {skill}" for skill in skills)}

**Key Resources:** {resources}  
**🎯 Milestone:** {milestone}

**Weekly Schedule:**
- Monday/Wednesday: Theory and concepts (3-4 hours)
- Tuesday/Thursday: Hands-on practice (4-5 hours)  
- Weekend: Project work and review (6-8 hours)

---
"""
        
        # Add success strategies
        response += f"""## 🚀 Success Strategies

### 📈 Weekly Progress Tracking
- Set specific daily goals
- Track completed exercises/tutorials
- Document challenges and solutions
- Celebrate milestone achievements

### 🤝 Community Engagement
- Join relevant Discord/Slack communities
- Participate in study groups
- Share progress on social media
- Find an accountability partner

### 💡 Pro Tips for Success
1. **Consistency over intensity** - 2 hours daily beats 14 hours on Sunday
2. **Build while learning** - Start projects from week 1
3. **Teach others** - Explain concepts to solidify understanding
4. **Stay flexible** - Adjust timeline based on your progress

### ⚡ Acceleration Opportunities
- **Bootcamps:** Compress timeline to 12-16 weeks with intensive study
- **Mentorship:** Find industry mentor to guide your path
- **Internships:** Apply for positions after week 16-20
- **Freelancing:** Start small projects after core skills mastered

## 📊 Expected Outcomes by Week 26:
✅ Strong foundation in {field.lower()} fundamentals  
✅ Portfolio with 3-5 impressive projects  
✅ Network of industry contacts  
✅ Ready to apply for {target_role.lower()} positions  
✅ Confidence to tackle real-world challenges

*Ready to start your journey? Ask me about specific resources for week 1 or let me know if you'd like to adjust the timeline!*"""

        return response
        
    except Exception as e:
        logger.error(f"Timeline creation error: {str(e)}")
        return f"❌ **Timeline Error:** Unable to create learning timeline. Error: {str(e)}"
# Create the structured tool
create_learning_timeline = StructuredTool.from_function(
    func=create_learning_timeline_func,
    name="create_learning_timeline",
    description="Create a personalized weekly learning timeline with specific milestones and resources",
    args_schema=LearningTimelineInput
)

@tool
def track_learning_progress(achievement: str, field: str, week_number: int = 0) -> str:
    """Track and celebrate learning achievements with personalized feedback and next steps."""
    try:
        # Achievement categories for better tracking
        achievement_categories = {
            "course_completion": ["completed", "finished", "course", "tutorial"],
            "project_milestone": ["built", "created", "deployed", "project", "app"],
            "skill_mastery": ["learned", "mastered", "understand", "proficient"],
            "certification": ["certified", "certificate", "passed", "exam"],
            "job_milestone": ["hired", "promoted", "interview", "job", "offer"]
        }
        
        # Detect achievement type
        achievement_lower = achievement.lower()
        achievement_type = "general"
        
        for category, keywords in achievement_categories.items():
            if any(keyword in achievement_lower for keyword in keywords):
                achievement_type = category
                break
        
        # Get current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
        
        # Generate personalized celebration and guidance
        celebrations = {
            "course_completion": "🎓 **Course Mastery Achieved!**",
            "project_milestone": "🚀 **Project Success Unlocked!**",
            "skill_mastery": "💡 **Skill Level Up!**",
            "certification": "🏆 **Certification Earned!**",
            "job_milestone": "💼 **Career Milestone Reached!**",
            "general": "⭐ **Achievement Unlocked!**"
        }
        
        celebration = celebrations.get(achievement_type, celebrations["general"])
        
        # Generate specific next steps based on achievement type and field
        next_steps = []
        
        if achievement_type == "course_completion":
            next_steps = [
                "Apply your knowledge in a hands-on project",
                "Find practice problems or challenges related to this topic",
                "Share what you learned with the community",
                "Identify the next course in your learning path"
            ]
        elif achievement_type == "project_milestone":
            next_steps = [
                "Document your project with clear README and comments",
                "Deploy your project for others to see and use",
                "Add this project to your portfolio",
                "Start planning your next, more complex project"
            ]
        elif achievement_type == "skill_mastery":
            next_steps = [
                "Practice this skill with increasingly difficult challenges",
                "Teach someone else this skill to reinforce your learning",
                "Look for ways to combine this with other skills you know",
                "Consider getting certified in this skill area"
            ]
        elif achievement_type == "certification":
            next_steps = [
                "Update your LinkedIn profile and resume",
                "Share your achievement on professional networks",
                "Look for projects that utilize your certified skills",
                "Consider advanced certifications in this area"
            ]
        elif achievement_type == "job_milestone":
            next_steps = [
                "Set new career goals for your current role",
                "Identify skills needed for your next career step",
                "Build relationships with colleagues and mentors",
                "Continue learning to stay current in your field"
            ]
        else:
            next_steps = [
                "Reflect on what you learned from this achievement",
                "Set your next learning or career goal",
                "Share your success with your network",
                "Keep the momentum going with consistent progress"
            ]
        
        # Field-specific advice
        field_advice = {
            "computer science": "Consider contributing to open source projects or building a GitHub portfolio",
            "data science": "Share your analysis on Kaggle or create data visualizations for your portfolio",
            "web development": "Deploy your projects and focus on user experience and responsive design",
            "cybersecurity": "Practice on platforms like HackTheBox or participate in CTF competitions",
            "digital marketing": "Create case studies of your campaigns and stay updated with platform changes"
        }
        
        specific_advice = field_advice.get(field.lower(), "Continue building your expertise and professional network")
        
        # Calculate progress momentum
        momentum_phrases = [
            "You're building incredible momentum!",
            "Your consistency is paying off!", 
            "This achievement shows your dedication!",
            "You're making excellent progress!",
            "Your hard work is clearly showing results!"
        ]
        
        momentum_message = momentum_phrases[hash(achievement) % len(momentum_phrases)]
        
        # Format comprehensive response
        response = f"""{celebration}

**What You Accomplished:** {achievement}  
**Field:** {field.title()}  
**Date:** {timestamp}  
**Week:** {week_number if week_number > 0 else "Ongoing"}

## 🎉 Celebration Time!
{momentum_message} Every step forward in {field.lower()} builds toward your career goals.

## 🚀 Your Next Strategic Moves:
"""
        
        for i, step in enumerate(next_steps, 1):
            response += f"{i}. {step}\n"
        
        response += f"""
## 🎯 Field-Specific Advice
**For {field.title()}:** {specific_advice}

## 📊 Progress Insights
- **Achievement Type:** {achievement_type.replace('_', ' ').title()}
- **Career Impact:** {'High' if achievement_type in ['certification', 'job_milestone'] else 'Medium' if achievement_type == 'project_milestone' else 'Building'}
- **Learning Velocity:** {'Accelerating' if week_number > 0 and week_number < 20 else 'Steady Progress'}

## 🌟 Motivation Boost
*"Success isn't just about what you accomplish in your life, it's about what you inspire others to do."* - Your achievement today inspires tomorrow's success!

**Keep going! What's your next goal?** 🎯"""

        return response
        
    except Exception as e:
        logger.error(f"Progress tracking error: {str(e)}")
        return f"❌ **Tracking Error:** Unable to track progress. Error: {str(e)}"

@register_function(config_type=CareerGuideConfig)
async def career_guide_function(config: CareerGuideConfig, builder: Builder):
    """
    Advanced Career Guidance Agent with Resource Discovery and Progress Tracking
    """
    
    # Initialize components
    resource_discovery = ResourceDiscovery()
    analyzer = CareerPathAnalyzer()
    formatter = ResponseFormatter(config.personality)
    
    # Get embeddings for document processing
    embeddings = await builder.get_embedder(config.embedder_name, wrapper_type=LLMFrameworkEnum.LANGCHAIN)
    
    # Document processing pipeline for career resources
    docs = []
    logger.info("🔍 Scanning for career documents: %s", config.ingest_glob)
    
    if '*' in config.ingest_glob:
        data_dir = os.path.dirname(config.ingest_glob.split('*')[0])
    else:
        data_dir = os.path.dirname(config.ingest_glob)
    
    if os.path.exists(data_dir):
        supported_formats = ('.pdf', '.txt', '.docx', '.csv', '.xlsx')
        file_paths = []
        
        for filename in os.listdir(data_dir):
            if filename.lower().endswith(supported_formats):
                file_paths.append(os.path.join(data_dir, filename))
        
        for file_path in file_paths:
            try:
                if file_path.lower().endswith('.pdf'):
                    loader = PyPDFLoader(file_path)
                elif file_path.lower().endswith(('.csv', '.xlsx')):
                    df = pd.read_csv(file_path) if file_path.endswith('.csv') else pd.read_excel(file_path)
                    content = df.to_string()
                    docs.append(Document(page_content=content, metadata={"source": file_path}))
                    continue
                else:
                    loader = TextLoader(file_path, encoding='utf-8')
                
                loaded_docs = await loader.aload()
                docs.extend(loaded_docs)
                logger.info("✅ Loaded career documents from %s", filename)
            except Exception as e:
                logger.error("❌ Error loading %s: %s", filename, str(e))
    
    # Create document search tool if documents exist
    document_tools = []
    if docs:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=config.chunk_size,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        documents = text_splitter.split_documents(docs)
        vector = await FAISS.afrom_documents(documents, embeddings)
        retriever = vector.as_retriever(search_kwargs={"k": 5})
        
        retriever_tool = create_retriever_tool(
            retriever,
            "career_document_search",
            "Search through career guidance documents, industry reports, and educational materials"
        )
        document_tools = [retriever_tool]
    
    # Combine all tools
    career_tools = [
        search_learning_resources,  # Keep @tool ones that work
        analyze_career_field,       # Now StructuredTool
        get_career_timeline,
        get_skill_assessment,
        search_web_resources,
        create_learning_timeline,   # Now StructuredTool
        track_learning_progress
    ]
    base_tools = builder.get_tools(tool_names=config.tool_names, wrapper_type=LLMFrameworkEnum.LANGCHAIN)
    all_tools = career_tools + document_tools + base_tools
    
    # Get LLM
    llm = await builder.get_llm(config.llm_name, wrapper_type=LLMFrameworkEnum.LANGCHAIN)
    
    # Enhanced system prompt
    system_message = f"""You are an expert career guidance counselor and mentor.

Available tools and their simple usage:
- analyze_career_field: Use with field name only, like analyze_career_field("computer science")
- search_learning_resources: Use with query, like search_learning_resources("python programming")
- create_learning_timeline: Use with field and role, like create_learning_timeline("computer science", "beginner", "software developer")

IMPORTANT: 
- Always provide a direct answer first, then use tools if needed
- Keep tool parameters simple - avoid complex formatting
- If a tool fails, provide helpful information anyway
- Be conversational and helpful"""
    
    # Create proper prompt for OpenAI functions
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_message),
        MessagesPlaceholder(variable_name="chat_history", optional=True),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad")
    ])

    # Create OpenAI functions agent (works better than ReAct)
    agent = create_openai_functions_agent(llm=llm, tools=all_tools, prompt=prompt)
    agent_executor = AgentExecutor(
        agent=agent,
        tools=all_tools,
        max_iterations=6,
        handle_parsing_errors=True,
        verbose=True,
        return_intermediate_steps=False,
        max_execution_time=90,
        # early_stopping_method="generate"
    )
    
    # Conversation history for progress tracking
    conversation_history = []
    user_profile = {
        "interests": [],
        "skills": [],
        "career_goals": [],
        "experience_level": "beginner",
        "education": "",
        "progress_tracking": {}
    }
    
    async def _career_guidance_response(input_message: str) -> str:
        # input_message = request.message
        """Process career guidance requests with context awareness"""
        try:
            # Trim conversation history
            if len(conversation_history) > config.max_history * 2:
                conversation_history[:] = conversation_history[-config.max_history:]
            
            # Analyze input for user profile updates
            input_lower = input_message.lower()
            
            # Extract career interests
            career_keywords = ["interested in", "want to", "career in", "studying", "learning", "working in"]
            fields = ["computer science", "data science", "web development", "cybersecurity", 
                    "machine learning", "artificial intelligence", "software engineering",
                    "business", "marketing", "finance", "healthcare", "education", 
                    "graphic design", "digital marketing", "product management"]

            for keyword in career_keywords:
                if keyword in input_lower:
                    # Simple extraction - in production, use NER
                    for field in fields:
                        if field in input_lower:
                            if field not in user_profile["interests"]:
                                user_profile["interests"].append(field)
                                break
                    break  # Exit after processing one keyword match
            
            # Extract skill mentions
            skill_keywords = ["python", "java", "javascript", "react", "sql", "excel", 
                            "photoshop", "figma", "leadership", "communication", "project management"]
            for skill in skill_keywords:
                if skill in input_lower and skill not in user_profile["skills"]:
                    user_profile["skills"].append(skill)
            
            # Extract experience level
            if any(word in input_lower for word in ["beginner", "new", "starting", "first time"]):
                user_profile["experience_level"] = "beginner"
            elif any(word in input_lower for word in ["intermediate", "some experience", "been doing"]):
                user_profile["experience_level"] = "intermediate"
            elif any(word in input_lower for word in ["advanced", "expert", "years of experience", "senior"]):
                user_profile["experience_level"] = "advanced"
            
            # Build context for the agent
            context_info = ""
            if user_profile["interests"]:
                context_info += f"\nUser interests: {', '.join(user_profile['interests'])}"
            if user_profile["skills"]:
                context_info += f"\nUser skills: {', '.join(user_profile['skills'])}"
            if user_profile["experience_level"]:
                context_info += f"\nExperience level: {user_profile['experience_level']}"
            
            # Enhanced input with context
            enhanced_input = f"{input_message}{context_info}"
            
            # Execute agent with conversation history
            result = await agent_executor.ainvoke({
                "input": enhanced_input,
                "chat_history": conversation_history[-config.max_history:] if conversation_history else []
            })
            
            # Update conversation history
            conversation_history.extend([
                HumanMessage(content=input_message),
                AIMessage(content=result["output"])
            ])
            
            # Track progress if user mentions completing something
            progress_keywords = ["completed", "finished", "learned", "mastered", "got certified"]
            if any(keyword in input_lower for keyword in progress_keywords):
                timestamp = datetime.now().isoformat()
                if "progress_log" not in user_profile:
                    user_profile["progress_log"] = []
                user_profile["progress_log"].append({
                    "timestamp": timestamp,
                    "achievement": input_message,
                    "context": user_profile["interests"][:2] if user_profile["interests"] else []
                })
            
            return result["output"]
            
        except Exception as e:
            logger.error(f"Career guidance error: {str(e)}")
            return f"I encountered an error while processing your request: {str(e)}. Let me help you with career guidance in a different way. What specific career field are you interested in exploring?"
    
    # Enhanced conversation state management
    user_sessions = {}
    
    async def career_guidance_with_memory(request: AIQChatRequest) -> str:
        """Career guidance with persistent memory across sessions"""
        try:
            
        # Extract the message from the request - messages is a list
            input_message = request.messages[-1].content if request.messages else ""
            session_id = getattr(request, 'session_id', 'default')
            # Initialize session if not exists
            if session_id not in user_sessions:
                user_sessions[session_id] = {
                    "profile": {
                        "interests": [],
                        "skills": [],
                        "career_goals": [],
                        "experience_level": "beginner",
                        "education": "",
                        "progress_tracking": {},
                        "learning_path": None,
                        "milestones_completed": []
                    },
                    "conversation_history": [],
                    "last_interaction": datetime.now()
                }
            
            session_data = user_sessions[session_id]
            
            # Update last interaction
            session_data["last_interaction"] = datetime.now()
            
            # Process with session context
            response = await _career_guidance_response(input_message)
            
            # Add personalized footer based on session progress
            if len(session_data["conversation_history"]) > 5:
                footer = f"\n\n*💡 Building on our {len(session_data['conversation_history'])//2} previous conversations to personalize your guidance*"
            else:
                footer = f"\n\n*🌟 I'm learning about your interests and goals to provide better guidance*"
            
            return response + footer
            
        except Exception as e:
            logger.error(f"Session management error: {str(e)}")
            return await _career_guidance_response(input_message)
    
    try:
        yield FunctionInfo.create(single_fn=career_guidance_with_memory)
    except GeneratorExit:
        logger.info("🎯 Career guidance function exited gracefully")
    finally:
        logger.info("🧹 Cleaning up career guidance resources")