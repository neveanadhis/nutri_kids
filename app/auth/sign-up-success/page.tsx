import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">📧</div>
            <CardTitle className="text-2xl text-green-600">Check Your Email!</CardTitle>
            <CardDescription>Almost there...</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              We've sent you a confirmation email. Click the link in the email to activate your account and start your
              nutrition journey!
            </p>
            <div className="text-2xl">🎉</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
