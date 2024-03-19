import { SignedIn, SignedOut, SignIn, ClerkProvider, SignOutButton } from '@clerk/chrome-extension';

function Settings(props){
    console.log('in the settings');
    return (
        <div>
            <SignedIn>
                <div>
                    You are signed in! <br/>
                    <SignOutButton>
                      <span style={{fontSize: "14pt"}}>Log out</span>
                    </SignOutButton>
                </div>
              </SignedIn>
              <SignedOut>
                <SignIn
                  afterSignInUrl='/'
                  signUpUrl='/sign-up'
                />
              </SignedOut>
        </div>
    );
}

export default Settings;