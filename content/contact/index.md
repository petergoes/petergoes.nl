---
	title: Contact
	description: Get in touch! I like to hear from you
	view: page
---
## Send me a message:

<form class="contact__form" action="https://petergoes-backend-app.herokuapp.com/contactform" method="POST">
	<ol>
		<li class="contact__form__element">
			<label class="contact__form__label" for="name">Your name:</label>
			<input class="contact__form__input" type="text" name="name" required />
		</li>

		<li class="contact__form__element">
			<label class="contact__form__label" name="email">Your email:</label>
			<input class="contact__form__input" type="email" name="email" required />
		</li>

		<li class="contact__form__element">
			<label class="contact__form__label" for="message">Your message:</label>
			<textarea class="contact__form__input" name="message" rows="10" required></textarea>
		</li>
	</ol>
	<input type="hidden" name="confirmemail" />
	<button class="contact__form__submit">Submit</button>
</form>

Or reach out to me on these platforms:
