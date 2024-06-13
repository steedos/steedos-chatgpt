import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak({
  })],
  trustHost: true,
  callbacks: {
    signIn({ profile, user, account, ...params }) {
      // console.log('signIn', profile, user, account, params)
      const { email_verified = false, groups = []} = profile as any
      // if (process.env.AUTH_KEYCLOAK_GROUP && !groups.includes(process.env.AUTH_KEYCLOAK_GROUP)) {
      //   return false;
      // }
      (user as any).groups = groups
      return true;
    },
    jwt({ token, user, ...params }) {
      // console.log('jwt', token, user, params)
      if (user) { // User is available during sign-in
        token.groups = (user as any).groups
      }
      return token
    },
    session({ session, token, ...params }) {
      // console.log('session', session, token, params)
      return { ...session, user: { ...session.user, groups: token.groups } };
    },
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
})
