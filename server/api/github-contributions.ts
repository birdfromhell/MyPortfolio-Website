import { createError } from 'h3';

// GitHub GraphQL API endpoint
const GITHUB_API = 'https://api.github.com/graphql';

export default defineEventHandler(async (event) => {
  try {
    // Get username from query params
    const query = getQuery(event);
    const username = query.username?.toString();
    
    if (!username) {
      throw createError({
        statusCode: 400,
        message: 'Username parameter is required'
      });
    }
    
    // Get GitHub token from env variable
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      throw createError({
        statusCode: 500,
        message: 'GitHub token not configured'
      });
    }
    
    // Define GraphQL query for contributions
    const graphqlQuery = {
      query: `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    contributionLevel
                  }
                }
              }
            }
          }
        }
      `,
      variables: { username }
    };
    
    // Make request to GitHub GraphQL API
    const response = await fetch(GITHUB_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(graphqlQuery)
    });
    
    const data = await response.json();
    
    if (data.errors) {
      throw createError({
        statusCode: 500,
        message: data.errors[0].message || 'GitHub API error'
      });
    }
    
    if (!data.data?.user) {
      throw createError({
        statusCode: 404,
        message: 'User not found'
      });
    }
    
    // Transform the data to match our expected format
    const calendar = data.data.user.contributionsCollection.contributionCalendar;

    interface ContributionDay {
      date: string;
      contributionCount: number;
      contributionLevel: string;
    }

    interface ContributionWeek {
      contributionDays: ContributionDay[];
    }

    const weeks = calendar.weeks.map((week: ContributionWeek) => ({
      days: week.contributionDays.map((day: ContributionDay) => ({
        date: day.date,
        count: day.contributionCount,
        // Convert GitHub's levels to our scale (0-4)
        level: ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE']
          .indexOf(day.contributionLevel)
      }))
    }));

    return {
      weeks,
      total: calendar.totalContributions
    };
  } catch (error) {
    const err = error as { statusCode?: number; message?: string };
    return createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'Failed to fetch GitHub data'
    });
  }
});