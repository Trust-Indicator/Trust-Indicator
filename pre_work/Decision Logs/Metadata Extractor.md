# DECISION LOG 
## Decision Details 
- Date: Sep 28th, 2023
- Decision Maker: Yifang, All member
  
## Background 
Our current Metadata Extractor functions as an isolated backend module. While it serves its primary purpose, its design presents data processing and output challenges, especially considering our system's integrated architecture. The reliance on console and text files for data output introduces complexities in data exchange and integration, which could adversely affect both the user experience and system scalability.

## Decision Options 

1. Continue using the current isolated backend module without modifications.
2. Evolve the standalone program into a functional utility class, built upon the .NET framework, that acts as a Wrapper to invoke the specialized metadata extraction tool, EXIFTOOL.

## Decision Rationale 

Option Chosen: Evolve into a functional utility class as a Wrapper.

Reasons for Decision:

1. Enhanced Modularity: Transitioning to a Wrapper class increases system modularity, ensuring better compatibility with frontend interfaces and database modules.
2. Intuitive Operations: The Wrapper class provides function-based interfaces, simplifying metadata operations for developers.
3. Expanded Capabilities: Beyond reading metadata, the utility class allows for metadata alteration and cloning, catering to diverse application scenarios.
4. Improved User Experience: Offering richer and more precise metadata information enhances the overall user experience.

Alternatives Considered:

Maintaining the existing isolated backend module. This option was ruled out due to its inherent limitations, which did not align with our project's growth and integration objectives.

## Decision Outcome 
We anticipate improved system coherence, simplified data exchanges, and an enhanced user experience by evolving our Metadata Extractor into a functional utility class. This decision ensures that our system is more adaptable, catering to various application scenarios, and is in line with our commitment to delivering accurate and comprehensive metadata information to our users.

## Expect Impact
With the Wrapper class in place, we expect smoother integration with other system modules, a reduction in data exchange complexities, and improved metadata handling capabilities, ensuring a richer user experience.
