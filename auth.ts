// import NextAuth, { type DefaultSession } from 'next-auth'

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       /** The user's id. */
//       id: string
//     } & DefaultSession['user']
//   }
// }

// const sessions: Record<string, any> = {};

// export const {
//   handlers: { GET, POST },
//   auth
// } = NextAuth({
//   providers: [], // Remove GitHub provider
//   callbacks: {
//     jwt({ token, profile }) {
//       if (profile) {
//         token.id = profile.id
//         token.image = profile.avatar_url || profile.picture
//       }
//       return token
//     },
//     session: async ({ session, token }) => {
//       if (session?.user && token?.id) {
//         session.user.id = String(token.id)
//       }

//       // Store or retrieve the session in the in-memory store
//       if (!session?.user?.id) {
//         // Generate a unique ID for the session
//         session.user.id = Math.random().toString(36).substring(7);
//       }
      
//       // Store the session using its ID
//       sessions[session.user.id] = session;

//       return session;
//     },
//     authorized({ auth }) {
//       return !!auth?.user // this ensures there is a logged-in user for every request
//     },
//     signIn({user, account, profile}) {
//       return Promise.resolve(true); // Assume successful authentication
//     },
//     redirect({url, baseUrl}) {
//       return Promise.resolve(baseUrl);
//     }
//   },
//   pages: {
//     signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
//   }
// })