from django.shortcuts import render, redirect
from django.contrib import messages

def home(request):
    """Home page view"""
    return render(request, 'core/home.html')

def about(request):
    """About page view"""
    return render(request, 'core/about.html')

def services(request):
    """Services page view"""
    return render(request, 'core/services.html')

def projects(request):
    """Projects page view"""
    return render(request, 'core/projects.html')

def contact(request):
    """Contact page view with form handling"""
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # Here you would typically save to database or send email
        # For now, we'll just show a success message
        messages.success(request, f'Thank you {name}! We have received your message and will get back to you soon.')
        return redirect('contact')
    
    return render(request, 'core/contact.html')

def join(request):
    """Join/Career page view with application form handling"""
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        position = request.POST.get('position')
        experience = request.POST.get('experience')
        linkedin = request.POST.get('linkedin')
        portfolio = request.POST.get('portfolio')
        cover_letter = request.POST.get('cover_letter')
        resume = request.FILES.get('resume')
        
        # Here you would typically save to database
        # For now, we'll just show a success message
        messages.success(request, f'Thank you {first_name}! Your application has been submitted successfully. We will review it and get back to you soon.')
        return redirect('join')
    
    return render(request, 'core/join.html')